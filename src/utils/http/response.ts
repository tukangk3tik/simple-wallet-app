
export const successResponse = (data: any) => ({
  status: 'OK',
  data: data,
});

export const successMsgResponse = (data: any, message: string) => {
  const obj = {
    status: 'OK',
    message: message,
  };

  if (data) {
    (obj as any).data = data;
  }

  return obj;
};

export const errorResponse = (message: string) => ({
  status: 'FAIL',
  message: message,
});
