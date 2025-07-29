const { Router } = require("express");
const authMiddleware = require("../middlewares/auth");
const adminMiddleware = require("../middlewares/admin");

const AdminController = require("../controllers/AdminController");
const MessageController = require("../controllers/MessageController");

const router = new Router();

router.use("/admin", authMiddleware, adminMiddleware);

router.get("/admin/pending-summaries", AdminController.listPendingSummaries);
router.post("/admin/summaries/:summaryId/approve", AdminController.approveSummary);
router.delete("/admin/summaries/:summaryId", AdminController.rejectSummary);

router.get("/admin/all-summaries", AdminController.listAllSummaries);

router.get("/admin/messages", MessageController.index);
router.delete("/admin/messages/:messageId", MessageController.destroy);

module.exports = router;