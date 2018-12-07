import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  session: service(),

  beforeModel(transition) {
    if (!this.session.user) {
      this.session.set('previousTransition', transition);
      this.transitionTo('login');
    }
  }
});
