namespace ViewModels.Contacts {

    export interface IOptionSelectorArgs {
        label: string;
        options: any[];
        optionsText: string;
        optionsValue: string;

    }

    class OptionSelector implements IOptionSelectorArgs {
        public label: string;
        public options: any[];
        public optionsText: string;
        public optionsValue: string;
        public optionExpressions: string;
        public selectedValue: string;

        static $inject = ['$modalInstance', 'args'];
        constructor(private $modalInstance, args: IOptionSelectorArgs) {
            this.label = args.label;
            this.options = args.options;
            this.optionsText = args.optionsText;
            this.optionsValue = args.optionsValue;
            this.optionExpressions = 'option[optionselector.optionsValue] as option[optionselector.optionsText] for option in optionselector.options';
            this.selectedValue = this.options.length > 0 ? this.options[0].id : null;
        }

        confirm () {
            var result = {
                selectedValue: this.selectedValue
            };
            this.$modalInstance.close(result);
        }

        cancel () {
            this.$modalInstance.dismiss('cancel');
        }
    }
    angular.module('viewmodel.contacts').controller('OptionSelectorController', OptionSelector);
}