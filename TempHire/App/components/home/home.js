var ViewModels;
(function (ViewModels) {
    var Home = (function () {
        function Home(logger) {
            this.logger = logger;
            this.title = 'Home View';
        }
        Home.prototype.activate = function () {
            this.logger.log('Home View Activated', null, 'home', true);
        };
        Home.$inject = ['logger'];
        return Home;
    })();
    angular.module('viewmodel.home', []).controller('HomeController', Home);
})(ViewModels || (ViewModels = {}));
//# sourceMappingURL=home.js.map