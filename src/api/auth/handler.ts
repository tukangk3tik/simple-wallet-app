import { userService } from '../../di/injection';
import { successMsgResponse } from '../../utils/http/response';

export const loginHandler = async (req: any, reply: any) => {
  const { email, password } = req.body;
  const user = await userService.verifyUserCredentials(email, password);
  
  const accessToken = req.server.jwt.sign(
    { sub: user.id },
    { expiresIn: '1h' }
  );
  
  reply.send(successMsgResponse(
    {
      accessToken: accessToken,
    },
    "Login success"
  ));
}