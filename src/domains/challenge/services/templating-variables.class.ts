/* eslint-disable @typescript-eslint/naming-convention */
export default class TemplatingVariablesClass {
  constructor(
    public readonly signature: string,
    public readonly nonprofit_name: string,
    public readonly donation_minimum: number | string,
    public readonly link_donate: string,
    public readonly link_expected: string,
    public readonly tracking_pixel: string,
  ) {
    this.donation_minimum =
      TemplatingVariablesClass.formatCurrency(donation_minimum);
  }

  static formatCurrency(amountInCents: string | number): string {
    const num = Number(amountInCents) / 100;
    return new Intl.NumberFormat(`en-US`, {
      currency: `USD`,
      style: 'currency',
    }).format(num);
  }
}
