
export const withdrawSchema = {
  type: 'object',
  properties: {
    accountType: { type: 'integer' },
    amount: { type: 'string' },
    toAddress: { type: 'string' },
  },
  required: ['accountType', 'amount', 'toAddress']
}