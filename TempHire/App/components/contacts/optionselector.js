var ViewModels;
(function (ViewModels) {
    var Contacts;
    (function (Contacts) {
        var OptionSelector = (function () {
            function OptionSelector($modalInstance, args) {
                this.$modalInstance = $modalInstance;
                this.label = args.label;
                this.options = args.options;
                this.optionsText = args.optionsText;
                this.optionsValue = args.optionsValue;
                this.optionExpressions = 'option[optionselector.optionsValue] as option[optionselector.optionsText] for option in optionselector.options';
                this.selectedValue = this.options.length > 0 ? this.options[0].id : null;
            }
            OptionSelector.prototype.confirm = function () {
                var result = {
                    selectedValue: this.selectedValue
                };
                this.$modalInstance.close(result);
            };
            OptionSelector.prototype.cancel = function () {
                this.$modalInstance.dismiss('cancel');
            };
            OptionSelector.$inject = ['$modalInstance', 'args'];
            return OptionSelector;
        })();
        angular.module('viewmodel.contacts').controller('OptionSelectorController', OptionSelector);
    })(Contacts = ViewModels.Contacts || (ViewModels.Contacts = {}));
})(ViewModels || (ViewModels = {}));
//# sourceMappingURL=optionselector.js.map