import PubSub from 'pubsub-js';

class ErrorHandler {

  displayError(resposta){

    let erros = resposta.errors;
    for(let erro of erros){
      PubSub.publish('Erro-de-Validacao', erro);
    }
  }
}

export default ErrorHandler;