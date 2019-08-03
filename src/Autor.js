import React, { Component } from 'react';
import $ from 'jquery';
import PubSub from 'pubsub-js';
import InputForm from './Components/InputForm';
import SubmitButton from './Components/SubmitButton';

class FormularioAutores extends Component {

  constructor(){

    super();
    this.state = {nome:'', email: '', senha: ''};
    this.enviaForm = this.enviaForm.bind(this);
    this.setNome = this.setNome.bind(this);
    this.setEmail = this.setEmail.bind(this);
    this.setSenha = this.setSenha.bind(this);
  }

  render(){

    return(

      <div className="pure-form pure-form-aligned">
        <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm}>
          <InputForm label="Nome" id="nome" type="text" name="nome" value={this.state.nome} onChange={this.setNome} />
          <InputForm label="Email" id="email" type="email" name="email" value={this.state.email} onChange={this.setEmail} />
          <InputForm label="Senha" id="senha" type="password" name="senha" value={this.state.senha} onChange={this.setSenha} />
          <SubmitButton label="Salvar" />
        </form>
      </div>
    );
  }

  enviaForm(event){

    event.preventDefault();
    $.ajax({

      method: "POST",
      url: "http://cdc-react.herokuapp.com/api/autores",
      contentType: "application/json",
      data: JSON.stringify({ nome: this.state.nome, email: this.state.email, senha: this.state.senha }),
      dataType: "json",
      success: (novaListagem)=> {
        PubSub.publish('atualiza-lista-autores', novaListagem);
        console.log(`Dados enviados com sucesso!`);
      },
      error: erro => {
        console.log(`Não foi possível enviar os dados para o servidor.`);
        throw new Error(erro);
      }
    })
  }

  setNome(event){
    this.setState({ nome: event.target.value });
  }

  setEmail(event){
    this.setState({ email: event.target.value });
  }

  setSenha(event){
    this.setState({ senha: event.target.value });
  }
}

class TabelaAutores extends Component {

  render(){

    return(

      <div>
        <table className="pure-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>email</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.lista.map(function(autor){
                return (

                  <tr key={autor.id}>
                    <td>{autor.nome}</td>
                    <td>{autor.email}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table> 
      </div>
    );
  }

}

export default class AutorBox extends Component {
  
  constructor(){
    
    super();
    this.state = {lista: []};
  }
  
  componentDidMount(){
    
    $.ajax({
      method: "GET",
      url: "http://cdc-react.herokuapp.com/api/autores",
      dataType: "JSON",
      success: function(resposta){
        
        this.setState({lista: resposta})
      }.bind(this),
      error: ()=> {console.log("Não foi possível recuperar os dados do servidor")}
    })

    PubSub.subscribe('atualiza-lista-autores', function(topico,novaListagem){
      this.setState({lista:novaListagem});
    }.bind(this));
  }

  render(){
    
    return(
      <>
        <FormularioAutores />
        <TabelaAutores lista={this.state.lista} />
      </>
    );
  }
}