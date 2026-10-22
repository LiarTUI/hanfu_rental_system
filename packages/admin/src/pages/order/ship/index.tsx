import { Empty } from 'antd';

// 商家端发货管理（TODO）——挂在订单管理分组下，仅商家角色可见（access: 'menuOrderShip'）
// - 数据面：仅展示当前商家自己店铺的订单（按 storeId 过滤），分「待发货 / 已发货」两组
// - 操作面：填写快递公司 + 物流单号提交发货，对接后端发货接口
function MerchantShip() {
  return (
    <div style={{ padding: 24 }}>
      <Empty description="商家端发货管理建设中（TODO）" />
    </div>
  );
}

export default MerchantShip;
