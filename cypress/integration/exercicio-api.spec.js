/// <reference types="cypress" />
import usuario from '../contracts/validar.usuario';
import { faker } from '@faker-js/faker';

let token

before(() => {
     cy.token('fulano@qa.com', 'teste').then(tkn => { token = tkn })
});

describe('Testes da Funcionalidade Usuários', () => {

     it('Deve validar contrato de usuários', () => {
          cy.request('usuarios').then(response => {
               return usuario.validateAsync(response.body)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          cy.request({
               method: 'GET',
               url: 'usuarios'
          }).then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
               expect(response.duration).to.be.lessThan(20)
          })
     });


     it('Deve cadastrar um usuário com sucesso', () => {
          cy.cadastrarUsuario(token, faker.internet.userName(), faker.internet.email(), faker.internet.password())
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": faker.internet.userName(),
                    "email": faker.internet.email(),
                    "password": faker.internet.password(),
                    "administrador": "true"
               },
               headers: { authorization: token }
          }).then((response) => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
          })
     })

     it('Deve validar um usuário com email inválido', () => {
          cy.cadastrarUsuario(token)
               .then(response => {
                    let id = response.body._id
                    cy.request({
                         method: 'PUT',
                         url: `usuarios/${id}`,
                         headers: { authorization: token },
                         body: {
                              "nome": "validar usuario",
                              "email": "Saige_Grant@hotmail.com",
                              "password": faker.internet.password(),
                              "administrador": "true"
                         },
                         failOnStatusCode: false
                    }).then(response => {
                         expect(response.body.message).to.equal('Este email já está sendo usado')
                    })
               })
     });


     it('Deve editar um usuário previamente cadastrado', () => {
          cy.cadastrarUsuario(token, faker.internet.userName(), faker.internet.email(), faker.internet.password())
               .then(response => {
                    let id = response.body._id
                    cy.request({
                         method: 'PUT',
                         url: `usuarios/${id}`,
                         headers: { authorization: token },
                         body: {
                              "nome": "Usuario editado",
                              "email": faker.internet.email(),
                              "password": faker.internet.password(),
                              "administrador": "true"
                         }
                    }).then(response => {
                         expect(response.body.message).to.equal('Registro alterado com sucesso')
                    })
               })
     });

     it('Deve deletar um usuário previamente cadastrado', () => {
          cy.request('usuarios').then(response => {
               let id = response.body.usuarios[0]._id
               cy.request({
                    method: 'DELETE',
                    url: `usuarios/${id}`,
                    headers: { authorization: token },
               }).then(response => {
                    expect(response.body.message).to.equal('Registro excluído com sucesso')
                    expect(response.status).to.equal(200)
               })
          });

     })
})
