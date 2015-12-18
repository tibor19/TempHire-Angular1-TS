namespace ViewModels.Contacts {

    class Contact {

        initialized: boolean = false;
        staffingResourceId: number;
        staffingResource;
        states: any[];
        private unitOfWork;
        
        static $inject = ['$q', '$routeParams', '$modal', 'breeze', 'unitofwork', 'errorhandler'];
        constructor(private $q, $routeParams, private $modal, private breeze, private unitOfWorkManager, errorhandler) {

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

        handleError() { }

        activate() {
            var self = this;

            if (this.initialized) { return; }

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
        }

        addPhoneNumber() {
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
        }

        setPrimaryPhoneNumber(phoneNumber) {
            if (phoneNumber.primary) return;

            this.staffingResource.setPrimaryPhoneNumber(phoneNumber);
        };

        deletePhoneNumber(phoneNumber) {
            if (phoneNumber.primary || this.staffingResource.phoneNumbers.length === 1) return;

            this.staffingResource.deletePhoneNumber(phoneNumber);
        };

        addAddress() {
            
            this.unitOfWork.addressTypes.all()
                .then((data) => {
                    var modalInstance = this.$modal.open({
                        templateUrl: '/App/components/contacts/optionselector.html',
                        controller: 'OptionSelectorController',
                        controllerAs: 'optionselector',
                        resolve: {
                            args: (): IOptionSelectorArgs => {
                                return {
                                    label: 'Select address type: ',
                                    options: data,
                                    optionsText: 'displayName',
                                    optionsValue: 'id'
                                };
                            }
                        }
                    });

                    modalInstance.result.then((response) => {
                        this.staffingResource.addAddress(response.selectedValue);
                    });
                })
                .catch(this.handleError);
        }

        deleteAddress(address) {
            if (address.primary || this.staffingResource.addresses.length === 1) return;

            this.staffingResource.deleteAddress(address);
        };

        setPrimaryAddress(address) {
            if (address.primary) return;

            this.staffingResource.setPrimaryAddress(address);
        };

    }
    angular.module('viewmodel.contacts', [])
        .controller('ContactsController', Contact);

}