import { ActionContext, z, Action } from 'genkit';
export { Action, ActionContext, z } from 'genkit';
import { ContextProvider } from 'genkit/context';
import { NextRequest, NextResponse } from 'next/server.js';
export { NextRequest, NextResponse } from 'next/server.js';

/**
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

declare function appRoute<C extends ActionContext = ActionContext, I extends z.ZodTypeAny = z.ZodTypeAny, O extends z.ZodTypeAny = z.ZodTypeAny, S extends z.ZodTypeAny = z.ZodTypeAny>(action: Action<I, O, S>, opts?: {
    contextProvider?: ContextProvider<C, I>;
}): (req: NextRequest) => Promise<NextResponse>;

export { appRoute, appRoute as default };
