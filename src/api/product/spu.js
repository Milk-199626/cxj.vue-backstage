import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  /*
  获取Spu分页列表
  */
  getSpuList({ page, limit, category3Id }) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: "GET",
      params: {
        category3Id
      }
    });
  },
  //添加Sup
  saveSpu(Spu) {
    return request({
      url: `${api_name}/saveSpuInfo`,
      method: "POST",
      data: Spu
    });
  },
  //更新Sup
  updateSpu(Spu) {
    return request({
      url: `${api_name}/updateSpuInfo`,
      method: "POST",
      data: Spu
    });
  },
  //获取所有品牌数据
  getTrademarkList() {
    return request({
      url: `${api_name}/baseTrademark/getTrademarkList`,
      method: "GET"
    });
  },
  //获取所有商品图片
  //GET /admin/product/spuImageList/{spuId}
  getSpuImageList(spuId) {
    return request({
      url: `${api_name}/spuImageList/${spuId}`,
      method: "GET"
    });
  },
  //获取spu销售属性值列表
  getSpuSaleAttrList(spuId) {
    return request({
      url: `${api_name}/spuSaleAttrList/${spuId}`,
      method: "GET"
    });
  },
  //获取所有销售属性列表
  salesAttrList() {
    return request({
      url: `${api_name}/baseSaleAttrList`,
      method: "GET"
    });
  }
};
