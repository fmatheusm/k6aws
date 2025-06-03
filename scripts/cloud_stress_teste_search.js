/*
1.Realizar consulta a API de listagem de busca por id
2.É esperado um RPS de 200 req/s para a api de listagem durante 30 segundo
3.Para a busca por id, o sistema deve atender 50 usuários onde cada usuário realiza até 20 solicitações em até 1m
    3.1.Usuário par deve realizar busca ao id 4
    3.2.usuário ímpar deve realizar busca ao id 5
4.Ambos os testes devem ser executados simultaneamente. 
Obs: Nesses testes serão utilizados scenarios
*/
// http://localhost:3333/api/ratings
// k6 run --env URL=https://quickpizza.grafana.com

import { check, sleep } from 'k6';
import http from 'k6/http';

export const options = {
    ext: {
        k6: {
            cloud: {
                name: 'curso-k6',
                projectID: 3773976,
            }
        }
    },
    stages: [
        { duration: '10s', target: 10 },
        { duration: '1m', target: 10 },
        { duration: '10s', target: 0 }
    ],
    thresholds: { checks: ['rate > 0.95'], http_req_duration: ['p(95) < 200'] },
};

export function setup() {
    const requestBody = JSON.stringify({
        username: 'default',
        password: "12345678",
    });

    const token = http.post(`https://quickpizza.grafana.com/api/users/token/login`, requestBody);
    return {
        headers: {
            'Authorization': `Bearer ${token.json('token')}`,
            'Content-Type': 'application/json'
        }
    }

}

export default function (headers) {
    const res = http.get('https://quickpizza.grafana.com/api/ratings', headers);
    check(res, {
        'lista com sucesso': r => r.status === 200,
    });
    sleep(1);
}