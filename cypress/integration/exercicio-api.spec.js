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
               url: 'produtos'
          }).then((response) => {
               expect(response.body.produtos[4].nome).to.equal('Controle de TV')
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('produtos')
               expect(response.duration).to.be.lessThan(50)
          })
     })


     it('Deve cadastrar um usuário com sucesso', () => {
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": "Josse Paulo Pedro",
                    "email": faker.internet.email(),
                    "password": "agigigiwa",
                    "administrador": "true"
               },
               headers: { authorization: token }
          }).then((response) => {
               expect(response.status).to.equal(201)
               expect(response.body.message).to.equal('Cadastro realizado com sucesso')
          })
     })

     it('Deve validar um usuário com email inválido', () => {
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body: {
                    "nome": "Jose Paulo Pedro",
                    "email": "Nettie_Halvorson@yahoo.com",
                    "password": "agigigiwa",
                    "administrador": "true"
               },
               headers: { authorization: token },
               failOnStatusCode: false
          }).then((response) => {
               expect(response.status).to.equal(400)
               expect(response.body.message).to.equal('Este email já está sendo usado')
          })
     });


     it('Deve editar um usuário previamente cadastrado', () => {
          cy.request('usuarios').then(response => {
               let id = response.body.usuarios[0]._id
               cy.request({
                   method: 'PUT',
                   url: `usuarios/${id}`,
                   headers: {authorization: token},
                   body: {
                       "nome": "Usuario editado forever",
                       "email": "taloasrswift@qa.com",
                       "password": "editando",
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
                   headers: {authorization: token},
          }).then(response =>{
               expect(response.body.message).to.equal('Registro excluído com sucesso')
               expect(response.status).to.equal(200)
          })
     });

})
})
