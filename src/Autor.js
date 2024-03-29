import React, { Component } from 'react';
import $ from 'jquery';
import InputForm from './Components/InputForm';
import PubSub from 'pubsub-js';
import ErrorHandler from './ErrorHandler';

class FormularioAutor extends Component {

  constructor() {
    super();
    this.state = { nome: '', email: '', senha: '' };
    this.enviaForm = this.enviaForm.bind(this);
  }

  enviaForm(evento) {
    evento.preventDefault();
    $.ajax({
      url: 'http://cdc-react.herokuapp.com/api/autores',
      contentType: 'application/json',
      dataType: 'json',
      type: 'post',
      data: JSON.stringify({ nome: this.state.nome, email: this.state.email, senha: this.state.senha }),
      success: function (novaListagem) {
        PubSub.publish('atualiza-lista-autores', novaListagem);
        this.setState({ nome: '', email: '', senha: '' });
      }.bind(this),
      error: function (resposta) {
        if (resposta.status === 400) {
          new ErrorHandler().displayError(resposta.responseJSON);
        }
      },
      beforeSend: function () {
        PubSub.publish("limpa-erros", {});
      }
    });
  }

  handleInputChange = event => {

    const { name, value } = event.target;

    this.setState({
      [name]: value
    });
  }

  render() {

    return (
      <div className="pure-form pure-form-aligned">
        <form className="pure-form pure-form-aligned" onSubmit={this.enviaForm} method="post">
          <InputForm id="nome" type="text" name="nome" value={this.state.nome} onChange={this.handleInputChange} label="Nome" />
          <InputForm id="email" type="email" name="email" value={this.state.email} onChange={this.handleInputChange} label="Email" />
          <InputForm id="senha" type="password" name="senha" value={this.state.senha} onChange={this.handleInputChange} label="Senha" />
          <div className="pure-control-group">
            <label></label>
            <button type="submit" className="pure-button pure-button-primary">Gravar</button>
          </div>
        </form>
      </div>
    );
  }
}

class TabelaAutores extends Component {

  render() {

    return (
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
              this.props.lista.map(function (autor) {
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

  constructor() {
    super();
    this.state = { lista: [] };
  }

  componentDidMount() {
    $.ajax({
      url: "http://cdc-react.herokuapp.com/api/autores",
      dataType: 'json',
      success: function (resposta) {
        this.setState({ lista: resposta });
      }.bind(this)
    }
    );

    PubSub.subscribe('atualiza-lista-autores', function (topico, novaLista) {
      this.setState({ lista: novaLista });
    }.bind(this));
  }


  render() {
    return (
      <div>
        <div className="header">
          <h1>Cadastro de autores</h1>
        </div>
        <div className="content" id="content">
          <FormularioAutor />
          <TabelaAutores lista={this.state.lista} />
        </div>

      </div>
    );
  }
}