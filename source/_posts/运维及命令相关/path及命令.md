1 usr表示的是unix system resource
2 /usr/bin中是全局的命令
3 自己定义的命令一般放在/usr/local/bin中，记得给其中的文件赋予权限chmod +x 文件名，不然会提示无权限。
4 echo $SHELL  输出当前用的是哪中命令行
5 echo $PATH 输出当前的环境变量（命令如果没有环境变量中就会找不到）
6 zsh的配置文件 ~/.zsh
7 bash的配置文件