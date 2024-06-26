import { createApp } from "./index.js";

import { UserModel } from "./users/mySqlModel.js";

createApp({ userModel: UserModel })