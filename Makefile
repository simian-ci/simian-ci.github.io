default: build

build:
	jekyll build

deploy:
	@-git remote add landing git@github.com:simian-ci/simian-ci.github.io.git
	cd .. && git subtree push --prefix landing/_site/ landing master
