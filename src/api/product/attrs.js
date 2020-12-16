import request from "@/utils/request";

const api_name = "/admin/product";

export default {
  /*
  获取1级分类列表
  */
  getCategory1() {
    return request({
      url: `${api_name}/getCategory1`,
      method: "GET"
    });
  },
  /*
  获取2级分类列表
  */
  getCategory2(category1Id) {
    return request({
      url: `${api_name}/getCategory2/${category1Id}`,
      method: "GET"
    });
  },
  /*
  获取3级分类列表
  */
  getCategory3(category2Id) {
    return request({
      url: `${api_name}/getCategory3/${category2Id}`,
      method: "GET"
    });
  },
  /*
  获取全部属性分类列表
  */
  getAttrInfoList({ category1Id, category2Id, category3Id }) {
    return request({
      url: `${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
      method: "GET"
    });
  },
  //获取全部属性值
  getAttrValueList(attrId) {
    return request({
      url: `${api_name}/getAttrValueList/${attrId}`,
      method: "GET"
    });
  },
  //删除属性值
  DeleteAttr(attrId) {
    return request({
      url: `${api_name}/deleteAttr/${attrId}`,
      method: "DELETE"
    });
  },
  //保存属性值
  SaveAttrInfo(Brand) {
    return request({
      url: `${api_name}/saveAttrInfo`,
      method: "POST",
      data: Brand
    });
  }
};
