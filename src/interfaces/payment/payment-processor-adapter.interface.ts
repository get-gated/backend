export type Charge = {
  id: string;
};

export default interface PaymentProcessorAdapterInterface {
  charge(amount: number, token: string, metadata?: any): Promise<Charge>;
}
