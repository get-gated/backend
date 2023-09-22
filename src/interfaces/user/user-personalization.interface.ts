import { UserBenefit } from './user.enums';

export abstract class UserBenefitSelectionInterface {
  userBenefit: UserBenefit;

  benefitLabel: string;

  otherText: string;

  constructor(props: UserBenefitSelectionInterface) {
    this.userBenefit = props.userBenefit;
    this.benefitLabel = props.benefitLabel;
    this.otherText = props.otherText;
  }
}

export abstract class UserPersonalizationInterface {
  userBenefitSelection: UserBenefitSelectionInterface;

  constructor(props: UserPersonalizationInterface) {
    this.userBenefitSelection = props.userBenefitSelection;
  }
}
