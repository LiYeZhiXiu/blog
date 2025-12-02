// 导入React Router的类型
type Location = import('react-router-dom').Location;
type NavigateFunction = import('react-router-dom').NavigateFunction;

declare namespace June_Index {
  // 定义目录项接口
  type TocItem = {
    id: string;
    title: string;
    level: number;
    childItem?: June_Index.TocItem[];
  }

  // 路由组件属性接口
  type RouterProps = {
    location: {
      pathname: string;
      search: string;
    };
    navigate: (to: string) => void;
  }

  // 路由组件属性接口（包含Location和NavigateFunction类型）
  type RouteComponentProps = {
    location: Location;
    navigate: NavigateFunction;
    params?: Record<string, string>;
  }
}
