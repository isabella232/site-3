import jointz from 'jointz/lib';

export const JsonRpcRequestValidator = jointz.object().keys({
  method: jointz.string(),
  jsonrpc: jointz.constant('2.0'),
  id: jointz.or(jointz.string(), jointz.number().integer()),
  params: jointz.array()
}).requiredKeys('method', 'jsonrpc', 'id')
  .allowUnknownKeys(true);

export const AddressValidator = jointz.string().pattern(/^0x[a-fA-F0-9]{40}$/);
export const HexDataValidator = jointz.string().pattern(/^0x[a-fA-F0-9]*$/);
export const ChainIdValidator = jointz.or(HexDataValidator, jointz.number());

export const SendTransactionParamValidator = jointz.object().keys({
  from: AddressValidator,
  to: AddressValidator,
  gas: HexDataValidator,
  gasPrice: HexDataValidator,
  value: HexDataValidator,
  data: HexDataValidator,
  nonce: HexDataValidator,
  chainId: ChainIdValidator,
}).requiredKeys('from').allowUnknownKeys(false);