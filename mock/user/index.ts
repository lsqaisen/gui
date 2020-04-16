export default {
  'GET /api/users/current': (req: any, res: any) => {
    // res.end(undefined);
    res.end(
      JSON.stringify({
        id: 'test',
        created_at: 'ttt',
        updated_at: 'ttt',
        username: 'ttt',
        email: 'ttt',
        remark: 'ttt',
        expired_at: 'ttt',
        privileges: 'ttt'
      })
    );
  }
};
