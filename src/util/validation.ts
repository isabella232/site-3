import jointz from 'jointz';

export const JsonRpcRequestValidator = jointz.object({
  method: jointz.string(),
  jsonrpc: jointz.constant('2.0'),
  id: jointz.or(jointz.string(), jointz.number().integer()),
  params: jointz.array(jointz.any())
}).requiredKeys('method', 'jsonrpc', 'id')
  .allowUnknownKeys(true);

export const AddressValidator = jointz.string().pattern(/^0x[a-fA-F0-9]{40}$/);
export const HexDataValidator = jointz.string().pattern(/^0x[a-fA-F0-9]*$/);
export const ChainIdValidator = jointz.or(HexDataValidator, jointz.number().integer().min(0));

export const SendTransactionParamValidator = jointz.object({
  from: AddressValidator,
  to: AddressValidator,
  gas: HexDataValidator,
  gasPrice: HexDataValidator,
  value: HexDataValidator,
  data: HexDataValidator,
  nonce: HexDataValidator,
  chainId: ChainIdValidator,
})
  .requiredKeys('from')
  // Web3 will sometimes send extra keys, e.g. gasLimit, as a number.
  // Don't throw because of it.
  .allowUnknownKeys(true);