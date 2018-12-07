import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import fetch from 'fetch';
import { task } from 'ember-concurrency';

export default Controller.extend({
  session: service(),
  router: service(),

  _token: computed('_username', '_password', function() {
    if (this._username && this._password) {
      return btoa(`global/${this._username}:${this._password}`);
    }
  }),

  _loginTask: task(function* _login() {
    let url = 'https://dev.phorest.com/memento/rest/allbusinesses?max=0&fetch_count=0'
    let token = this._token;

    let response = yield fetch(url, {
      method: 'GET',
      headers: {
          Accept: 'application/vnd.memento.Business+json',
          Authorization: `Basic ${token}`
      }
    })

    if (!response.ok) {
      alert('Error authenticating');

      return;
    }

    this.session.user = this._token;

    if (this.session.previousTransition) {
      this.session.previousTransition.retry();
    } else {
      this.router.transitionTo('session');
    }
  })
});
