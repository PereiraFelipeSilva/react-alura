import React, { Component } from 'react';
import PubSub from 'pubsub-js';

class InputForm extends Component {

  constructor() {

    super();
    this.state = { msgErro: '' }
  }

  render() {

    return (

      <div className="pure-control-group">
        <label htmlFor={this.props.id}> {this.props.label} </label>
        <input {...this.props} />
        <span className="error"> {this.state.msgErro} </span>
      </div>
    );
  }

  componentDidMount() {

    PubSub.subscribe('Erro-de-Validacao', (topico, erro) => {

      if (erro.field === this.props.name)
        this.setState({ msgErro: erro.defaultMessage })
    });

    PubSub.subscribe('limpa-erros', topico => {

      this.setState({ msgErro: '' })
    })
  }
}

export default InputForm;