var ViewModels;
(function (ViewModels) {
    var Contacts;
    (function (Contacts) {
        var Contact = (function () {
            function Contact($q, $routeParams, $modal, breeze, unitOfWorkManager, errorhandler) {
                this.$q = $q;
                this.$modal = $modal;
                this.breeze = breeze;
                this.unitOfWorkManager = unitOfWorkManager;
                this.initialized = false;
                this.$q = $q;
                this.$modal = $modal;
                this.breeze = breeze;
                this.initialized = false;
                this.staffingResourceId = $routeParams.id;
                this.staffingResource = null;
                this.states = [];
                this.unitOfWorkManager = unitOfWorkManager;
                var ref = unitOfWorkManager.get($routeParams.id);
                this.unitOfWork = ref.value();
                errorhandler.includeIn(this);
            }
            Contact.prototype.handleError = function () { };
            Contact.prototype.activate = function () {
                var self = this;
                if (this.initialized) {
                    return;
                }
                var root = this.unitOfWork.staffingResources.withId(this.staffingResourceId)
                    .then(function (data) {
                    self.staffingResource = data;
                });
                // Load states
                var states = this.unitOfWork.states.all()
                    .then(function (data) {
                    self.states = data;
                });
                // Load addresses
                var predicate = this.breeze.Predicate.create("staffingResourceId", "==", this.staffingResourceId);
                var addresses = this.unitOfWork.addresses.find(predicate);
                // Load phone numbers
                var phoneNumbers = this.unitOfWork.phoneNumbers.find(predicate);
                this.$q.all([root, states, addresses, phoneNumbers]).then(function () {
                    self.initialized = true;
                }).catch(self.handleError);
            };
            Contact.prototype.addPhoneNumber = function () {
                var self = this;
                self.unitOfWork.phoneNumberTypes.all()
                    .then(function (data) {
                    var modalInstance = self.$modal.open({
                        templateUrl: '/App/components/contacts/optionselector.html',
                        controller: 'OptionSelectorController',
                        controllerAs: 'optionselector',
                        resolve: {
                            args: function () {
                                return {
                                    label: 'Select phone type: ',
                                    options: data,
                                    optionsText: 'name',
                                    optionsValue: 'id'
                                };
                            }
                        }
                    });
                    modalInstance.result.then(function (response) {
                        self.staffingResource.addPhoneNumber(response.selectedValue);
                    });
                })
                    .catch(self.handleError);
            };
            Contact.prototype.setPrimaryPhoneNumber = function (phoneNumber) {
                if (phoneNumber.primary)
                    return;
                this.staffingResource.setPrimaryPhoneNumber(phoneNumber);
            };
            ;
            Contact.prototype.deletePhoneNumber = function (phoneNumber) {
                if (phoneNumber.primary || this.staffingResource.phoneNumbers.length === 1)
                    return;
                this.staffingResource.deletePhoneNumber(phoneNumber);
            };
            ;
            Contact.prototype.addAddress = function () {
                var _this = this;
                this.unitOfWork.addressTypes.all()
                    .then(function (data) {
                    var modalInstance = _this.$modal.open({
                        templateUrl: '/App/components/contacts/optionselector.html',
                        controller: 'OptionSelectorController',
                        controllerAs: 'optionselector',
                        resolve: {
                            args: function () {
                                return {
                                    label: 'Select address type: ',
                                    options: data,
                                    optionsText: 'displayName',
                                    optionsValue: 'id'
                                };
                            }
                        }
                    });
                    modalInstance.result.then(function (response) {
                        _this.staffingResource.addAddress(response.selectedValue);
                    });
                })
                    .catch(this.handleError);
            };
            Contact.prototype.deleteAddress = function (address) {
                if (address.primary || this.staffingResource.addresses.length === 1)
                    return;
                this.staffingResource.deleteAddress(address);
            };
            ;
            Contact.prototype.setPrimaryAddress = function (address) {
                if (address.primary)
                    return;
                this.staffingResource.setPrimaryAddress(address);
            };
            ;
            Contact.$inject = ['$q', '$routeParams', '$modal', 'breeze', 'unitofwork', 'errorhandler'];
            return Contact;
        })();
        angular.module('viewmodel.contacts', [])
            .controller('ContactsController', Contact);
    })(Contacts = ViewModels.Contacts || (ViewModels.Contacts = {}));
})(ViewModels || (ViewModels = {}));
//# sourceMappingURL=contacts.js.map