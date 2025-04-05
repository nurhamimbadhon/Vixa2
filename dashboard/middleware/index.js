const { threadsData } = global.db;

function isPostMethod(req) {
	return req.method == "POST";
}

module.exports = function (checkAuthConfigDashboardOfThread) {
	return {
		isAuthenticated(req, res, next) {
			if (req.isAuthenticated())
				return next();

			if (isPostMethod(req))
				return res.status(401).send({
					status: "error",
					error: "PERMISSION_DENIED",
					message: "please try again later"
				});

			req.flash("errors", { msg: "You must be logged in" });
			res.redirect(`/login?redirect=${req.originalUrl}`);
		},

		unAuthenticated(req, res, next) {
			if (!req.isAuthenticated())
				return next();

			if (isPostMethod(req))
				return res.status(401).send({
					status: "error",
					error: "PERMISSION_DENIED",
					message: "Baigan 🦆💨"
				});

			res.redirect("/");
		},

		isVeryfiUserIDFacebook(req, res, next) {
			if (req.user.facebookUserID)
				return next();

			if (isPostMethod(req))
				return res.status(401).send({
					status: "error",
					error: "PERMISSION_DENIED",
					message: "You are not authenticated  Facebook id👋🦆"
				});

			req.flash("errors", { msg: "Bạn cần phải xác thực id facebook trước khi thực hiện hành động này" });
			res.redirect(`/verifyfbid?redirect=${req.originalUrl}`);
		},

		isWaitVerifyAccount(req, res, next) {
			if (req.session.waitVerifyAccount)
				return next();

			if (isPostMethod(req))
				return res.status(401).send({
					status: "error",
					error: "PERMISSION_DENIED",
					message: "An error occurred, please try again"
				});

			res.redirect("/register");
		},

		async checkHasAndInThread(req, res, next) {
			const userID = req.user.facebookUserID;
			const threadID = isPostMethod(req) ? req.body.threadID : req.params.threadID;
			const threadData = await threadsData.get(threadID);

			if (!threadData) {
				if (isPostMethod(req))
					return res.status(401).send({
						status: "error",
						error: "PERMISSION_DENIED",
						message: "Không tìm thấy nhóm này"
					});

				req.flash("errors", { msg: "Thread not found" });
				return res.redirect("/dashboard");
			}

			const findMember = threadData.members.find(m => m.userID == userID && m.inGroup == true);
			if (!findMember) {
				if (isPostMethod(req))
					return res.status(401).send({
						status: "error",
						error: "PERMISSION_DENIED",
						message: "This group was not found."
					});

				req.flash("errors", { msg: "You are not in this chat group" });
				return res.redirect("/dashboard");
			}
			req.threadData = threadData;
			next();
		},

		async middlewareCheckAuthConfigDashboardOfThread(req, res, next) {
			const threadID = isPostMethod(req) ? req.body.threadID : req.params.threadID;
			if (checkAuthConfigDashboardOfThread(threadID, req.user.facebookUserID))
				return next();

			if (isPostMethod(req))
				return res.status(401).send({
					status: "error",
					error: "PERMISSION_DENIED",
					message: "Bạn không có quyền chinh sửa nhóm này"
				});

			req.flash("errors", {
				msg: "[!] Chỉ quản trị viên của nhóm chat hoặc những thành viên được cho phép mới có thể chỉnh sửa dashboard"
			});
			return res.redirect("/dashboard");
		},

		async isAdmin(req, res, next) {
			const userID = req.user.facebookUserID;
			if (!global.GoatBot.config.adminBot.includes(userID)) {
				if (isPostMethod(req))
					return res.status(401).send({
						status: "error",
						error: "PERMISSION_DENIED",
						message: "you are not admin for this bot"
					});

				req.flash("errors", { msg: "Bạn không phải là admin của bot" });
				return res.redirect("/dashboard");
			}
			next();
		}
	};
};
