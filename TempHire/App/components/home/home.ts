namespace ViewModels {

    class Home {

        public title = 'Home View';

        static $inject = ['logger'];
        constructor(private logger) {
        }

        activate() {
            this.logger.log('Home View Activated', null, 'home', true);
        }
    }

    angular.module('viewmodel.home', []).controller('HomeController', Home);
}