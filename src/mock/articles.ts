// 文章接口定义
export interface Article {
  id: number;
  title: string;
  date: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  imageUrl?: string;
}

// 分类信息接口
export interface CategoryInfo {
  name: string;
  count: number;
}

// 文章数据
export const articles: Article[] = [
  {
    id: 1,
    title: 'git安装及使用',
    date: '2021-12-20',
    summary: '一.安装环境 1.本机系统：Windows 10(64位) 2.git：2.34.1(64位) 二.下载路径 <a href="https://git-scm.com/downloads">https://git-scm.com/downloads</a> 三.开始安装</h2>',
    content: `<h2>一.安装环境</h2>
<h3>1.本机系统：Windows 10(64位)</h3>
<h3>2.git：2.34.1(64位)</h3>
<h2>二.下载路径 <a href="https://git-scm.com/downloads">https://git-scm.com/downloads</a></h2>
<h2>三.开始安装</h2>
<h3>1.选定自己下载的版本 </h3>
<img src="https://img.alicdn.com/imgextra/i1/3009450924/O1CN01HnogG41IhF4ELGUws_!!3009450924.png" alt="" />
<h3>2.下载成功后，双击"Git-2.34.1-64.exe",开始安装git  </h3>
<img src="https://img.alicdn.com/imgextra/i1/3009450924/O1CN01z6SLoy1IhF4DSrzyK_!!3009450924.png" alt="" />
<h3>3.点击【Next】按钮</h3>
<img src="https://img.alicdn.com/imgextra/i1/3009450924/O1CN01NO2y3R1IhF4ELFYkz_!!3009450924.png" alt="" />
<h3>4.点击【Next】按钮</h3>
<img src="https://img.alicdn.com/imgextra/i2/3009450924/O1CN01ehAbDO1IhF4EeB1Yz_!!3009450924.png" alt="" />
<h3>5.点击【Install】按钮</h3>
<img src="https://img.alicdn.com/imgextra/i4/3009450924/O1CN01OaDQ8n1IhF4DSsKlQ_!!3009450924.png" alt="" />
<h3>6.点击【Finish】按钮</h3>
<img src="https://img.alicdn.com/imgextra/i2/3009450924/O1CN01qnpbgU1IhF4F8YBOR_!!3009450924.png" alt="" />
<h3>7.查看git是否安装成功</h3>
<img src="https://img.alicdn.com/imgextra/i2/3009450924/O1CN01zNw9Rw1IhF4EALnHr_!!3009450924.png" alt="" />
<pre><code>git --version</code></pre>
<h2>四.git使用</h2>
<h3>1.设置用户名及邮件</h3>
<pre><code>
  git config --global user.name "yourname"
  git config --global user.email "youremail"
  git config -l
</code></pre>
<img src="https://img.alicdn.com/imgextra/i2/3009450924/O1CN01DdbJM51IhF4EEGE3I_!!3009450924.png" alt="" />
<h3> 2.将本地的master分支推送到origin主机</h3>
<pre><code>
  git push -u origin master
</code></pre>
<h3> 3.从远程获取代码并合并本地的版本</h3>
<pre><code>
  git pull origin blogMaster
</code></pre>
<h3> 4.允许不相关的历史记录</h3>
<pre><code>
  git pull origin blogMaster --allow-unrelated-histories
</code></pre>
<h3> 5.把github项目克隆到本地文件夹中</h3>
<pre><code>
 git clone https://github.com/LiYeZhiXiu/LiYeZhiXiu.github.io.git
</code></pre>
<h3> 6.如果报OpenSSl SSL_read:Connection was reset,errno 1054</h3>
<pre><code>
  git config --global http.sslVerify "false"
</code></pre>
<img src="https://img.alicdn.com/imgextra/i3/3009450924/O1CN01NOuzJf1IhF4Ede8Ob_!!3009450924.png" alt="" />
<h3> 7.添加ssh key</h3>
<pre><code>
  ssh-keygen -t rsa -C "github邮箱"
</code></pre>
<img src="https://img.alicdn.com/imgextra/i4/3009450924/O1CN01zQ04tF1IhF4F8YeUO_!!3009450924.png" alt="" />
<h3> 8.检测ssh是否添加成功</h3>
<pre><code>
  ssh -T git@github.com
</code></pre>
<img src="https://img.alicdn.com/imgextra/i1/3009450924/O1CN013Bxuh71IhF4EeChVH_!!3009450924.png" alt="" />
<h3> 9.把本地项目上传到GitHub中</h3>
<pre><code>
 git init
 git add .
 git commit -m "xxx"
 git remote add origin https://github.com/LiYeZhiXiu/text11122.git
 git push -u origin master
</code></pre>
`,
    category: 'git',
    tags: ['git'],
    imageUrl: 'https://img.alicdn.com/imgextra/i2/39767794/O1CN01KNrA6E27Rhf3aZzms_!!39767794.jpg'
  },
  {
    id: 2,
    title: 'Hexo博客实现流程',
    date: '2021-12-22',
    summary: 'hexo官网 https://hexo.io/zh-cn/一.hexo搭建步骤1.安装Node.js https://LiYeZhiXiu.github.io/post/node/1/2.安装Git http://LiYeZhiXiu.github.io/post/git/1/3.在GitHub创建个人仓库',
    content: `
<h2>hexo官网 <a href="https://hexo.io/zh-cn/">https://hexo.io/zh-cn/</a></h2>
<h2>一.hexo搭建步骤</h2>
<h3>1.安装Node.js https://LiYeZhiXiu.github.io/post/node/1/</h3>
<h3>2.安装Git http://LiYeZhiXiu.github.io/post/git/1/</h3>
<h3>3.在GitHub创建个人仓库及生成ssh添加到GitHub</h3>
<h3>4.将hexo部署到GitHub</h3>
<h2> 二.hexo博客实现 </h2>
<h3> 1.安装hexo-cli，按Enter键回车</h3>
<pre><code>
  npm i -g hexo-cli
</code></pre>
<h3> 2.创建博客blog，按Enter键回车</h3>
<pre><code>
  hexo init blog
</code></pre>
<h3> 3.安装依赖 cd blog，按Enter键回车</h3>
<pre><code></code>
  npm i
</code></pre>
<h3> 4.生成静态界面，按Enter键回车</h3>
<pre><code></code>
  hexo g
</code></pre>
<h3> 5.启动服务，按Enter键回车</h3>
<pre><code></code>
  hexo s
</code></pre>
<h3> 6.实现界面</h3>
<h2>三.创建一个仓库及生成ssh添加到GitHub</h2>
<h3> 1.注册一个GitHub账户 https://github.com/</h3>
<h3> 2.创建一个跟你同名仓库，后面加上.github.io.</h3>
<h3> 3.生成ssh添加到GitHub，按Enter键回车</h3>
<pre><code>
  git config --global user.name "github用户名"
  git config --global user.name "github邮箱"
</code></pre>
<h3> 4.检测是否添加成功，按Enter键回车</h3>
<pre><code>
  git config -l
</code></pre>
<h3> 5.创建ssh，按Enter键回车</h3>
<pre><code>
  ssh-keygen -t rsa -C "github邮箱"
</code></pre>
<h3> 6.将id_rsa.pub内容复制到GitHub上</h3>
<h3> 7.检测是否添加成功，按Enter键回车</h3>
<pre><code></code>
  ssh -T git@github.com
</code></pre>
<h2>四.hexo部署到GitHub</h2>
<h3> 1.安装hexo-deployer-git插件，按Enter键回车</h3>
<pre><code>
  deploy:
  type: git
  repo:  https://GitHub中的token@github.com/HuYiMi/HuYiMi.github.io.git
  branch: master
</code></pre>
<h3>2.安装hexo-deployer-git,然后执行hexo命令</h3>
<pre><code>
  npm i hexo-deployer-git --save
  hexo clean
  hexo g
  hexo d
</code></pre>
<h3> 3.执行hexo d后结果</h3>
<h3> 4.执行以下命令,再重新执行hexo d</h3>
<pre><code>
  git config --global http.sslVerify "false"
</code></pre>
<h3>5.重新执行hexo d,如果报之前错，就重复以上命令</h3>
<h3>6.到GitHub上看是否上传成功</h3>
<h3>7.在地址栏中输入yourname.github.io,结果如下1</h3>
`,
    category: 'hexo',
    tags: ['hexo'],
    imageUrl: 'https://img.alicdn.com/imgextra/i2/39767794/O1CN01KNrA6E27Rhf3aZzms_!!39767794.jpg'
  }
];

// 模拟API调用函数
export const fetchArticles = async (): Promise<Article[]> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 300));
  return articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};