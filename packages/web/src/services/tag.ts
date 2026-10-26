import { request } from '@umijs/max';

// 场景标签字典：首页「场景提案」与量体裁案「场景选择」共用
// 返回结构：{ success, data: SceneItem[], errorMsg }
export interface SceneItem {
  id: number;
  name: string;
  imageUrl: string | null;
}

export const getScenes = () => {
  return request('/api/tag/scenes');
};
