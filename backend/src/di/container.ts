import { Container } from "typedi";
import { TOKENS } from "./tokens";

import { AuthService } from "@/services/implements/auth.service";
import { UserRepository } from "@/repositories/implements/user.repository";
import { ProjectService } from "@/services/implements/project.service";
import { ProjectRepository } from "@/repositories/implements/project.repository";
import { TaskService } from "@/services/implements/task.service";
import { TaskRepository } from "@/repositories/implements/task.repository";
import { UserService } from "@/services/implements/user.service";
import { SocketService } from "@/services/implements/socket.service";

Container.set({
  id: TOKENS.AuthService,
  type: AuthService,
});

Container.set({
  id: TOKENS.ProjectService,
  type: ProjectService,
});

Container.set({
  id: TOKENS.TaskService,
  type: TaskService,
});

Container.set({
  id: TOKENS.UserService,
  type: UserService,
});

Container.set({
  id: TOKENS.SocketService,
  type: SocketService,
});

Container.set({
  id: TOKENS.UserRepository,
  type: UserRepository,
});

Container.set({
  id: TOKENS.ProjectRepository,
  type: ProjectRepository,
});

Container.set({
  id: TOKENS.TaskRepository,
  type: TaskRepository,
});