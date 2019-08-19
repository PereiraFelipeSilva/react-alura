import PubSub from 'pubsub-js';

export default class ErrorHandler {
	displayError(erros) {
		for (var i = 0; i < erros.errors.length; i++) {
			var erro = erros.errors[i];
			PubSub.publish("erro-validacao", erro);
		}
	}
}