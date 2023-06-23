// Import controllers
const authController = require("./controllers/authController");
const userController = require("./controllers/userController");
const checkUserFn = require("./middlewares/checkUserFn");
const checkUserFnSolution = require("./middlewares/checkUserFnSolution");
const loggingFn = require("./middlewares/loggingFn");
const rateLimitFn = require("./middlewares/rateLimit");
const validateFn = require("./middlewares/validateFn");

// Match URL's with controllers
exports.appRoute = (router) => {
  // LOGIN
  router.post(
    "/api/user/login",
    loggingFn.logLoginData,
    rateLimitFn.loginCountLimit,
    validateFn.validateEmail,
    authController.processLogin
  );
  // REGISTER
  router.post(
    "/api/user/register",
    loggingFn.logData,
    rateLimitFn.registerCountLimit,
    validateFn.validateRegister,
    authController.processRegister
  );

  // USER SEARCH SUBMISSION
  router.get(
    "/api/user/process-search-design/:pagenumber/:search?",
    loggingFn.logData,
    checkUserFnSolution.checkForValidUser,
    validateFn.validateUserSearchOwnSubmission,
    userController.processGetSubmissionData
  );
  // USER SUBMIT DESIGN
  router.post(
    "/api/user/process-submission",
    loggingFn.logData,
    checkUserFnSolution.checkForValidUser,
    validateFn.validateDesignTitleAndDesc,
    validateFn.validateFileTypeAndSize,
    rateLimitFn.designSubmissionCountLimit,
    userController.processDesignSubmission
  );
  // USER UPDATE DESIGN (RETREIVE PHASE)
  router.get(
    "/api/user/design/:fileId",
    checkUserFnSolution.checkForValidUser,
    userController.processGetOneDesignData
  );
  // USER UPDATE DESIGN (UPDATE PHASE)
  router.put(
    "/api/user/design/",
    loggingFn.logData,
    checkUserFnSolution.checkForValidUser,
    validateFn.validateDesignTitleAndDesc,
    userController.processUpdateOneDesign
  );
  // USER SEND INVITATION EMAIL
  router.post(
    "/api/user/processInvitation/",
    loggingFn.logData,
    checkUserFnSolution.checkForValidUser,
    validateFn.validateEmailRecipient,
    rateLimitFn.emailInvitationCountLimit,
    userController.processSendInvitation
  );
  // USER VIEW PROFILE (RETRIEVE PHASE)
  router.get(
    "/api/user/:recordId",
    checkUserFnSolution.checkForValidUser,
    userController.processGetOneUserData
  );

  // ADMIN SEARCH USER
  router.get(
    "/api/user/process-search-user/:pagenumber/:search?",
    loggingFn.logData,
    checkUserFnSolution.checkValidAdminRole,
    validateFn.validateSearchUserByName,
    userController.processGetUserData
  );
  // ADMIN SEARCH SUBMISSION BY EMAIL
  router.get(
    "/api/user/process-search-user-design/:pagenumber/:search?",
    loggingFn.logData,
    checkUserFnSolution.checkValidAdminRole,
    validateFn.validateSearchUserSubByEmail,
    userController.processGetSubmissionsbyEmail
  );
  // ADMIN CHANGE USER ROLE (UPDATE PHASE)
  router.put(
    "/api/user/",
    loggingFn.logData,
    checkUserFnSolution.checkValidAdminRole,
    userController.processUpdateOneUser
  );

  //ADDED - RETRIEVES USER ROLE TO MAKE SURE ONLY USER CAN ACCESS USER PAGES AND ONLY ADMIN CAN ACCESS ADMIN PAGES
  router.get("/api/currentUserRole", checkUserFnSolution.retrieveUserRole);
};
