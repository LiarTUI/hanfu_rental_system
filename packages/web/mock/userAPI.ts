const users = [
  { id: 0, name: 'Umi', nickName: 'U', gender: 'MALE' },
  { id: 1, name: 'Fish', nickName: 'B', gender: 'FEMALE' },
];

export default {
  'GET /api/v1/queryUserList': (req: any, res: any) => {
    res.json({
      success: true,
      data: { list: users },
      errorCode: 0,
    });
  },
  'PUT /api/v1/user/': (req: any, res: any) => {
    res.json({
      success: true,
      errorCode: 0,
    });
  },
  'POST /api/user/login': (req: any, res: any) => {
    const { account, password } = req.body;
    if (account && password) {
      res.json({ success: true, errorCode: 0 });
    } else {
      res.json({ success: false, errorCode: 1, errorMsg: '账号或密码错误' });
    }
  },
  'POST /api/admin/login': (req: any, res: any) => {
    const { account, password } = req.body;
    if (account === 'admin' && password === '123456') {
      res.json({ success: true, errorCode: 0 });
    } else {
      res.json({ success: false, errorCode: 1, errorMsg: '账号或密码错误' });
    }
  },
  'POST /api/user/register': (req: any, res: any) => {
    const { account } = req.body;
    if (account === 'admin') {
      res.json({ success: false, errorCode: 1, errorMsg: '账号已存在' });
    } else {
      res.json({ success: true, errorCode: 0 });
    }
  },
};
