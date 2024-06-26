# API Golden Raspberry Awards - Elias

Teste para cargo de Backend NodeJS por Elias "API RESTful para possibilitar a leitura da lista de indicados e vencedores da categoria Pior Filme do Golden Raspberry Awards."

## Requisito do sistema:

Ler o arquivo CSV dos filmes e inserir os dados em uma base de dados ao iniciar a
aplicação.

## Requisitos da API:

Obter o produtor com maior intervalo entre dois prêmios consecutivos, e o que
obteve dois prêmios mais rápido.

## Requisitos não funcionais:
* Web Service RESTful com base no nível 2 de maturidade de Richardson
* Teste de integração, garantindo que os dados obtidos estão de acordo com os dados fornecidos na proposta 
* Banco de dados em memória 

## Requisitos para execução da aplicação
* NodeJS v20

## Instalação
Antes de executar a aplicação, certifique-se de estar utilizando a versão 20 no Node com npm e execute o comando

```bash
npm install
```

## Rodando a aplicação
Para rodar o servidor
```
npm run start
```
Para rodar em modo de desenvolvimento
```
npm run dev
```
*Obs.: Por padrão a aplicação irá executar na porta 3000, caso queira apontar para outra porta basta alterar a variável PORT no arquivo .env*

## Implementação dos requisitos
### Stacks utilizadas
Construi uma API simples utilizando o **Express.js** com **TypeScript** e o **Typeorm** como ORM para modelagem e integração com base de dados, o banco de dados escolhido foi o **Sqlite** pelo fato de ser um banco armazenado em memória sem a necessidade de instalações externas à aplicação conforme solicitado nos requisitos do teste. Para os testes de integração usei o **Supertest** e o **Jest**.


### Leitura do csv
Toda vez que o servidor é iniciado o banco (sqlite) é criado em memória com os dados do csv conforme solicitado. (o arquivo csv está disponível na pasta "data" em "data/movielist.csv" ).

### API
Conforme solicitado implementei a rota para "Obter o produtor com maior intervalo entre dois prêmios consecutivos, e o que obteve dois prêmios mais rápido." Através de uma rota com RESTful com base no nível 2 de maturidade de Richardson.

#### Fazendo a requisição para a rota:
A rota implementada (implementada conforme o formato solicitado), caso queira visualizar diferentes resultados basta alterar o arquivo data/movielist.csv

**Método**: [GET] <br>
**URL**: http://localhost:3000/producers/winners/intervals  <br>
<sub>***A porta default é 3000 mas caso esteja executando em outra porta é necessário ajustar a url*** </sub><br>
**Exemplo de Retorno**: <Br>
``` 
{
    "min": [
        {
            "producer": "Joel Silver",
            "interval": 1,
            "previousWin": 1990,
            "followingWin": 1991
        }
    ],
    "max": [
        {
            "producer": "Matthew Vaughn",
            "interval": 13,
            "previousWin": 2002,
            "followingWin": 2015
        }
    ]
}
```

### Testes de integração
Os testes de integração estão disponíveis no repositório /src/tests/ basicamente eu testei 4 cenários:
* **Cenário que valido exatamente o valor do retorno segundo o movielist.csv fornecido no teste** 
* Cenário onde produtores que venceram mais de uma vez e seus intervalos máximos e mínimos
* Cenário onde filmes com multiplos produtores que venceram mais de uma vez e compartilham do mesmo intervalo (testa se listou todos que "empataram" em relação ao intervalo)
* Cenário onde não são encontrados vencedores com intervalos mínimos e máximos
#### Executando os testes de integração:
```
npm run test
```

### Arquitetura / Design
Implementei uma arquitetura simples, porém organizada e bem estruturada com o objetivo de facilitar a leitura e reuso do código, além de aplicar algumas boas práticas básicas na organização de uma aplicação.
#### Breve resumo sobre as camadas que decidi implementar
* / = Raiz onde são armazenados os arquivos de configuração da aplicação e as pastas necessárias para seu funcionamento.
* src/ = pasta principal da aplicação, contém as pastas principais e os arquivos que iniciam a aplicação e o servidor node
* src/domain/controllers/ = Contém os controllers da aplicação, responsáveis por controlar e executar as entradas e saídas de determinada rota, irá receber a requisição chamar o serviço responsável por processar as regras de negócio e retornar o sucesso ou erro no processamento. 
* src/domain/services/ = Contém os serviços da parte negocial da aplicação, responsáveis por recuperar os dados através de repositórios do TypeORM e processar as regras de negócio do domínio específico
* src/domain/entities/ = Contém as entidades pertencentes ao modelo da aplicação 
* src/infra/database/ = Contém os arquivos configuração do banco de dados
* src/infra/services/ = Contém o arquivo do serviço do CSV que pega os dados do arquivo e insere no banco de dados
* src/tests/ = Contém os testes de integração da aplicação
