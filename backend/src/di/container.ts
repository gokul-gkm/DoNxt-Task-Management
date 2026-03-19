import { Container } from "typedi";
import { TOKENS } from "./tokens";

import { AuthService } from "@/services/implements/auth.service";
import { UserRepository } from "@/repositories/implements/user.repository";

Container.set({
  id: TOKENS.AuthService,
  type: AuthService,
});

Container.set({
  id: TOKENS.UserRepository,
  type: UserRepository,
});