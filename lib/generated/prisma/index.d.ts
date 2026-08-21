
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Pengawas
 * 
 */
export type Pengawas = $Result.DefaultSelection<Prisma.$PengawasPayload>
/**
 * Model Student
 * 
 */
export type Student = $Result.DefaultSelection<Prisma.$StudentPayload>
/**
 * Model EducationCost
 * 
 */
export type EducationCost = $Result.DefaultSelection<Prisma.$EducationCostPayload>
/**
 * Model Father
 * 
 */
export type Father = $Result.DefaultSelection<Prisma.$FatherPayload>
/**
 * Model Mother
 * 
 */
export type Mother = $Result.DefaultSelection<Prisma.$MotherPayload>
/**
 * Model Guardian
 * 
 */
export type Guardian = $Result.DefaultSelection<Prisma.$GuardianPayload>
/**
 * Model Document
 * 
 */
export type Document = $Result.DefaultSelection<Prisma.$DocumentPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Pengawas
 * const pengawas = await prisma.pengawas.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Pengawas
   * const pengawas = await prisma.pengawas.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.pengawas`: Exposes CRUD operations for the **Pengawas** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Pengawas
    * const pengawas = await prisma.pengawas.findMany()
    * ```
    */
  get pengawas(): Prisma.PengawasDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.student`: Exposes CRUD operations for the **Student** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Students
    * const students = await prisma.student.findMany()
    * ```
    */
  get student(): Prisma.StudentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.educationCost`: Exposes CRUD operations for the **EducationCost** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more EducationCosts
    * const educationCosts = await prisma.educationCost.findMany()
    * ```
    */
  get educationCost(): Prisma.EducationCostDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.father`: Exposes CRUD operations for the **Father** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Fathers
    * const fathers = await prisma.father.findMany()
    * ```
    */
  get father(): Prisma.FatherDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.mother`: Exposes CRUD operations for the **Mother** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Mothers
    * const mothers = await prisma.mother.findMany()
    * ```
    */
  get mother(): Prisma.MotherDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.guardian`: Exposes CRUD operations for the **Guardian** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Guardians
    * const guardians = await prisma.guardian.findMany()
    * ```
    */
  get guardian(): Prisma.GuardianDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.document`: Exposes CRUD operations for the **Document** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Documents
    * const documents = await prisma.document.findMany()
    * ```
    */
  get document(): Prisma.DocumentDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Pengawas: 'Pengawas',
    Student: 'Student',
    EducationCost: 'EducationCost',
    Father: 'Father',
    Mother: 'Mother',
    Guardian: 'Guardian',
    Document: 'Document'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "pengawas" | "student" | "educationCost" | "father" | "mother" | "guardian" | "document"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Pengawas: {
        payload: Prisma.$PengawasPayload<ExtArgs>
        fields: Prisma.PengawasFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PengawasFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PengawasPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PengawasFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PengawasPayload>
          }
          findFirst: {
            args: Prisma.PengawasFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PengawasPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PengawasFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PengawasPayload>
          }
          findMany: {
            args: Prisma.PengawasFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PengawasPayload>[]
          }
          create: {
            args: Prisma.PengawasCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PengawasPayload>
          }
          createMany: {
            args: Prisma.PengawasCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PengawasCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PengawasPayload>[]
          }
          delete: {
            args: Prisma.PengawasDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PengawasPayload>
          }
          update: {
            args: Prisma.PengawasUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PengawasPayload>
          }
          deleteMany: {
            args: Prisma.PengawasDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PengawasUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PengawasUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PengawasPayload>[]
          }
          upsert: {
            args: Prisma.PengawasUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PengawasPayload>
          }
          aggregate: {
            args: Prisma.PengawasAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePengawas>
          }
          groupBy: {
            args: Prisma.PengawasGroupByArgs<ExtArgs>
            result: $Utils.Optional<PengawasGroupByOutputType>[]
          }
          count: {
            args: Prisma.PengawasCountArgs<ExtArgs>
            result: $Utils.Optional<PengawasCountAggregateOutputType> | number
          }
        }
      }
      Student: {
        payload: Prisma.$StudentPayload<ExtArgs>
        fields: Prisma.StudentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.StudentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.StudentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          findFirst: {
            args: Prisma.StudentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.StudentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          findMany: {
            args: Prisma.StudentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>[]
          }
          create: {
            args: Prisma.StudentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          createMany: {
            args: Prisma.StudentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.StudentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>[]
          }
          delete: {
            args: Prisma.StudentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          update: {
            args: Prisma.StudentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          deleteMany: {
            args: Prisma.StudentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.StudentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.StudentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>[]
          }
          upsert: {
            args: Prisma.StudentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$StudentPayload>
          }
          aggregate: {
            args: Prisma.StudentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateStudent>
          }
          groupBy: {
            args: Prisma.StudentGroupByArgs<ExtArgs>
            result: $Utils.Optional<StudentGroupByOutputType>[]
          }
          count: {
            args: Prisma.StudentCountArgs<ExtArgs>
            result: $Utils.Optional<StudentCountAggregateOutputType> | number
          }
        }
      }
      EducationCost: {
        payload: Prisma.$EducationCostPayload<ExtArgs>
        fields: Prisma.EducationCostFieldRefs
        operations: {
          findUnique: {
            args: Prisma.EducationCostFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationCostPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.EducationCostFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationCostPayload>
          }
          findFirst: {
            args: Prisma.EducationCostFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationCostPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.EducationCostFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationCostPayload>
          }
          findMany: {
            args: Prisma.EducationCostFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationCostPayload>[]
          }
          create: {
            args: Prisma.EducationCostCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationCostPayload>
          }
          createMany: {
            args: Prisma.EducationCostCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.EducationCostCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationCostPayload>[]
          }
          delete: {
            args: Prisma.EducationCostDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationCostPayload>
          }
          update: {
            args: Prisma.EducationCostUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationCostPayload>
          }
          deleteMany: {
            args: Prisma.EducationCostDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.EducationCostUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.EducationCostUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationCostPayload>[]
          }
          upsert: {
            args: Prisma.EducationCostUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$EducationCostPayload>
          }
          aggregate: {
            args: Prisma.EducationCostAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateEducationCost>
          }
          groupBy: {
            args: Prisma.EducationCostGroupByArgs<ExtArgs>
            result: $Utils.Optional<EducationCostGroupByOutputType>[]
          }
          count: {
            args: Prisma.EducationCostCountArgs<ExtArgs>
            result: $Utils.Optional<EducationCostCountAggregateOutputType> | number
          }
        }
      }
      Father: {
        payload: Prisma.$FatherPayload<ExtArgs>
        fields: Prisma.FatherFieldRefs
        operations: {
          findUnique: {
            args: Prisma.FatherFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FatherPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.FatherFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FatherPayload>
          }
          findFirst: {
            args: Prisma.FatherFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FatherPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.FatherFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FatherPayload>
          }
          findMany: {
            args: Prisma.FatherFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FatherPayload>[]
          }
          create: {
            args: Prisma.FatherCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FatherPayload>
          }
          createMany: {
            args: Prisma.FatherCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.FatherCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FatherPayload>[]
          }
          delete: {
            args: Prisma.FatherDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FatherPayload>
          }
          update: {
            args: Prisma.FatherUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FatherPayload>
          }
          deleteMany: {
            args: Prisma.FatherDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.FatherUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.FatherUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FatherPayload>[]
          }
          upsert: {
            args: Prisma.FatherUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$FatherPayload>
          }
          aggregate: {
            args: Prisma.FatherAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateFather>
          }
          groupBy: {
            args: Prisma.FatherGroupByArgs<ExtArgs>
            result: $Utils.Optional<FatherGroupByOutputType>[]
          }
          count: {
            args: Prisma.FatherCountArgs<ExtArgs>
            result: $Utils.Optional<FatherCountAggregateOutputType> | number
          }
        }
      }
      Mother: {
        payload: Prisma.$MotherPayload<ExtArgs>
        fields: Prisma.MotherFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MotherFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MotherFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherPayload>
          }
          findFirst: {
            args: Prisma.MotherFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MotherFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherPayload>
          }
          findMany: {
            args: Prisma.MotherFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherPayload>[]
          }
          create: {
            args: Prisma.MotherCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherPayload>
          }
          createMany: {
            args: Prisma.MotherCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MotherCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherPayload>[]
          }
          delete: {
            args: Prisma.MotherDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherPayload>
          }
          update: {
            args: Prisma.MotherUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherPayload>
          }
          deleteMany: {
            args: Prisma.MotherDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MotherUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MotherUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherPayload>[]
          }
          upsert: {
            args: Prisma.MotherUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MotherPayload>
          }
          aggregate: {
            args: Prisma.MotherAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMother>
          }
          groupBy: {
            args: Prisma.MotherGroupByArgs<ExtArgs>
            result: $Utils.Optional<MotherGroupByOutputType>[]
          }
          count: {
            args: Prisma.MotherCountArgs<ExtArgs>
            result: $Utils.Optional<MotherCountAggregateOutputType> | number
          }
        }
      }
      Guardian: {
        payload: Prisma.$GuardianPayload<ExtArgs>
        fields: Prisma.GuardianFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GuardianFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuardianPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GuardianFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuardianPayload>
          }
          findFirst: {
            args: Prisma.GuardianFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuardianPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GuardianFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuardianPayload>
          }
          findMany: {
            args: Prisma.GuardianFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuardianPayload>[]
          }
          create: {
            args: Prisma.GuardianCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuardianPayload>
          }
          createMany: {
            args: Prisma.GuardianCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GuardianCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuardianPayload>[]
          }
          delete: {
            args: Prisma.GuardianDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuardianPayload>
          }
          update: {
            args: Prisma.GuardianUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuardianPayload>
          }
          deleteMany: {
            args: Prisma.GuardianDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GuardianUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GuardianUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuardianPayload>[]
          }
          upsert: {
            args: Prisma.GuardianUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GuardianPayload>
          }
          aggregate: {
            args: Prisma.GuardianAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGuardian>
          }
          groupBy: {
            args: Prisma.GuardianGroupByArgs<ExtArgs>
            result: $Utils.Optional<GuardianGroupByOutputType>[]
          }
          count: {
            args: Prisma.GuardianCountArgs<ExtArgs>
            result: $Utils.Optional<GuardianCountAggregateOutputType> | number
          }
        }
      }
      Document: {
        payload: Prisma.$DocumentPayload<ExtArgs>
        fields: Prisma.DocumentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DocumentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DocumentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          findFirst: {
            args: Prisma.DocumentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DocumentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          findMany: {
            args: Prisma.DocumentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          create: {
            args: Prisma.DocumentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          createMany: {
            args: Prisma.DocumentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DocumentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          delete: {
            args: Prisma.DocumentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          update: {
            args: Prisma.DocumentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          deleteMany: {
            args: Prisma.DocumentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DocumentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DocumentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          upsert: {
            args: Prisma.DocumentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          aggregate: {
            args: Prisma.DocumentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDocument>
          }
          groupBy: {
            args: Prisma.DocumentGroupByArgs<ExtArgs>
            result: $Utils.Optional<DocumentGroupByOutputType>[]
          }
          count: {
            args: Prisma.DocumentCountArgs<ExtArgs>
            result: $Utils.Optional<DocumentCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    pengawas?: PengawasOmit
    student?: StudentOmit
    educationCost?: EducationCostOmit
    father?: FatherOmit
    mother?: MotherOmit
    guardian?: GuardianOmit
    document?: DocumentOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type PengawasCountOutputType
   */

  export type PengawasCountOutputType = {
    students: number
  }

  export type PengawasCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    students?: boolean | PengawasCountOutputTypeCountStudentsArgs
  }

  // Custom InputTypes
  /**
   * PengawasCountOutputType without action
   */
  export type PengawasCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PengawasCountOutputType
     */
    select?: PengawasCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PengawasCountOutputType without action
   */
  export type PengawasCountOutputTypeCountStudentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentWhereInput
  }


  /**
   * Count Type StudentCountOutputType
   */

  export type StudentCountOutputType = {
    educationCosts: number
    documents: number
  }

  export type StudentCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    educationCosts?: boolean | StudentCountOutputTypeCountEducationCostsArgs
    documents?: boolean | StudentCountOutputTypeCountDocumentsArgs
  }

  // Custom InputTypes
  /**
   * StudentCountOutputType without action
   */
  export type StudentCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the StudentCountOutputType
     */
    select?: StudentCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * StudentCountOutputType without action
   */
  export type StudentCountOutputTypeCountEducationCostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EducationCostWhereInput
  }

  /**
   * StudentCountOutputType without action
   */
  export type StudentCountOutputTypeCountDocumentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Pengawas
   */

  export type AggregatePengawas = {
    _count: PengawasCountAggregateOutputType | null
    _avg: PengawasAvgAggregateOutputType | null
    _sum: PengawasSumAggregateOutputType | null
    _min: PengawasMinAggregateOutputType | null
    _max: PengawasMaxAggregateOutputType | null
  }

  export type PengawasAvgAggregateOutputType = {
    id: number | null
  }

  export type PengawasSumAggregateOutputType = {
    id: number | null
  }

  export type PengawasMinAggregateOutputType = {
    id: number | null
    username: string | null
    password: string | null
    name: string | null
    wilayah: string | null
  }

  export type PengawasMaxAggregateOutputType = {
    id: number | null
    username: string | null
    password: string | null
    name: string | null
    wilayah: string | null
  }

  export type PengawasCountAggregateOutputType = {
    id: number
    username: number
    password: number
    name: number
    wilayah: number
    _all: number
  }


  export type PengawasAvgAggregateInputType = {
    id?: true
  }

  export type PengawasSumAggregateInputType = {
    id?: true
  }

  export type PengawasMinAggregateInputType = {
    id?: true
    username?: true
    password?: true
    name?: true
    wilayah?: true
  }

  export type PengawasMaxAggregateInputType = {
    id?: true
    username?: true
    password?: true
    name?: true
    wilayah?: true
  }

  export type PengawasCountAggregateInputType = {
    id?: true
    username?: true
    password?: true
    name?: true
    wilayah?: true
    _all?: true
  }

  export type PengawasAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pengawas to aggregate.
     */
    where?: PengawasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pengawas to fetch.
     */
    orderBy?: PengawasOrderByWithRelationInput | PengawasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PengawasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pengawas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pengawas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Pengawas
    **/
    _count?: true | PengawasCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PengawasAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PengawasSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PengawasMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PengawasMaxAggregateInputType
  }

  export type GetPengawasAggregateType<T extends PengawasAggregateArgs> = {
        [P in keyof T & keyof AggregatePengawas]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePengawas[P]>
      : GetScalarType<T[P], AggregatePengawas[P]>
  }




  export type PengawasGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PengawasWhereInput
    orderBy?: PengawasOrderByWithAggregationInput | PengawasOrderByWithAggregationInput[]
    by: PengawasScalarFieldEnum[] | PengawasScalarFieldEnum
    having?: PengawasScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PengawasCountAggregateInputType | true
    _avg?: PengawasAvgAggregateInputType
    _sum?: PengawasSumAggregateInputType
    _min?: PengawasMinAggregateInputType
    _max?: PengawasMaxAggregateInputType
  }

  export type PengawasGroupByOutputType = {
    id: number
    username: string
    password: string
    name: string
    wilayah: string
    _count: PengawasCountAggregateOutputType | null
    _avg: PengawasAvgAggregateOutputType | null
    _sum: PengawasSumAggregateOutputType | null
    _min: PengawasMinAggregateOutputType | null
    _max: PengawasMaxAggregateOutputType | null
  }

  type GetPengawasGroupByPayload<T extends PengawasGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PengawasGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PengawasGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PengawasGroupByOutputType[P]>
            : GetScalarType<T[P], PengawasGroupByOutputType[P]>
        }
      >
    >


  export type PengawasSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password?: boolean
    name?: boolean
    wilayah?: boolean
    students?: boolean | Pengawas$studentsArgs<ExtArgs>
    _count?: boolean | PengawasCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["pengawas"]>

  export type PengawasSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password?: boolean
    name?: boolean
    wilayah?: boolean
  }, ExtArgs["result"]["pengawas"]>

  export type PengawasSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password?: boolean
    name?: boolean
    wilayah?: boolean
  }, ExtArgs["result"]["pengawas"]>

  export type PengawasSelectScalar = {
    id?: boolean
    username?: boolean
    password?: boolean
    name?: boolean
    wilayah?: boolean
  }

  export type PengawasOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "password" | "name" | "wilayah", ExtArgs["result"]["pengawas"]>
  export type PengawasInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    students?: boolean | Pengawas$studentsArgs<ExtArgs>
    _count?: boolean | PengawasCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PengawasIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PengawasIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PengawasPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Pengawas"
    objects: {
      students: Prisma.$StudentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      username: string
      password: string
      name: string
      wilayah: string
    }, ExtArgs["result"]["pengawas"]>
    composites: {}
  }

  type PengawasGetPayload<S extends boolean | null | undefined | PengawasDefaultArgs> = $Result.GetResult<Prisma.$PengawasPayload, S>

  type PengawasCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PengawasFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PengawasCountAggregateInputType | true
    }

  export interface PengawasDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Pengawas'], meta: { name: 'Pengawas' } }
    /**
     * Find zero or one Pengawas that matches the filter.
     * @param {PengawasFindUniqueArgs} args - Arguments to find a Pengawas
     * @example
     * // Get one Pengawas
     * const pengawas = await prisma.pengawas.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PengawasFindUniqueArgs>(args: SelectSubset<T, PengawasFindUniqueArgs<ExtArgs>>): Prisma__PengawasClient<$Result.GetResult<Prisma.$PengawasPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Pengawas that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PengawasFindUniqueOrThrowArgs} args - Arguments to find a Pengawas
     * @example
     * // Get one Pengawas
     * const pengawas = await prisma.pengawas.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PengawasFindUniqueOrThrowArgs>(args: SelectSubset<T, PengawasFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PengawasClient<$Result.GetResult<Prisma.$PengawasPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pengawas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PengawasFindFirstArgs} args - Arguments to find a Pengawas
     * @example
     * // Get one Pengawas
     * const pengawas = await prisma.pengawas.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PengawasFindFirstArgs>(args?: SelectSubset<T, PengawasFindFirstArgs<ExtArgs>>): Prisma__PengawasClient<$Result.GetResult<Prisma.$PengawasPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Pengawas that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PengawasFindFirstOrThrowArgs} args - Arguments to find a Pengawas
     * @example
     * // Get one Pengawas
     * const pengawas = await prisma.pengawas.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PengawasFindFirstOrThrowArgs>(args?: SelectSubset<T, PengawasFindFirstOrThrowArgs<ExtArgs>>): Prisma__PengawasClient<$Result.GetResult<Prisma.$PengawasPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Pengawas that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PengawasFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Pengawas
     * const pengawas = await prisma.pengawas.findMany()
     * 
     * // Get first 10 Pengawas
     * const pengawas = await prisma.pengawas.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const pengawasWithIdOnly = await prisma.pengawas.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PengawasFindManyArgs>(args?: SelectSubset<T, PengawasFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PengawasPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Pengawas.
     * @param {PengawasCreateArgs} args - Arguments to create a Pengawas.
     * @example
     * // Create one Pengawas
     * const Pengawas = await prisma.pengawas.create({
     *   data: {
     *     // ... data to create a Pengawas
     *   }
     * })
     * 
     */
    create<T extends PengawasCreateArgs>(args: SelectSubset<T, PengawasCreateArgs<ExtArgs>>): Prisma__PengawasClient<$Result.GetResult<Prisma.$PengawasPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Pengawas.
     * @param {PengawasCreateManyArgs} args - Arguments to create many Pengawas.
     * @example
     * // Create many Pengawas
     * const pengawas = await prisma.pengawas.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PengawasCreateManyArgs>(args?: SelectSubset<T, PengawasCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Pengawas and returns the data saved in the database.
     * @param {PengawasCreateManyAndReturnArgs} args - Arguments to create many Pengawas.
     * @example
     * // Create many Pengawas
     * const pengawas = await prisma.pengawas.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Pengawas and only return the `id`
     * const pengawasWithIdOnly = await prisma.pengawas.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PengawasCreateManyAndReturnArgs>(args?: SelectSubset<T, PengawasCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PengawasPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Pengawas.
     * @param {PengawasDeleteArgs} args - Arguments to delete one Pengawas.
     * @example
     * // Delete one Pengawas
     * const Pengawas = await prisma.pengawas.delete({
     *   where: {
     *     // ... filter to delete one Pengawas
     *   }
     * })
     * 
     */
    delete<T extends PengawasDeleteArgs>(args: SelectSubset<T, PengawasDeleteArgs<ExtArgs>>): Prisma__PengawasClient<$Result.GetResult<Prisma.$PengawasPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Pengawas.
     * @param {PengawasUpdateArgs} args - Arguments to update one Pengawas.
     * @example
     * // Update one Pengawas
     * const pengawas = await prisma.pengawas.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PengawasUpdateArgs>(args: SelectSubset<T, PengawasUpdateArgs<ExtArgs>>): Prisma__PengawasClient<$Result.GetResult<Prisma.$PengawasPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Pengawas.
     * @param {PengawasDeleteManyArgs} args - Arguments to filter Pengawas to delete.
     * @example
     * // Delete a few Pengawas
     * const { count } = await prisma.pengawas.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PengawasDeleteManyArgs>(args?: SelectSubset<T, PengawasDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pengawas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PengawasUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Pengawas
     * const pengawas = await prisma.pengawas.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PengawasUpdateManyArgs>(args: SelectSubset<T, PengawasUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Pengawas and returns the data updated in the database.
     * @param {PengawasUpdateManyAndReturnArgs} args - Arguments to update many Pengawas.
     * @example
     * // Update many Pengawas
     * const pengawas = await prisma.pengawas.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Pengawas and only return the `id`
     * const pengawasWithIdOnly = await prisma.pengawas.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PengawasUpdateManyAndReturnArgs>(args: SelectSubset<T, PengawasUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PengawasPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Pengawas.
     * @param {PengawasUpsertArgs} args - Arguments to update or create a Pengawas.
     * @example
     * // Update or create a Pengawas
     * const pengawas = await prisma.pengawas.upsert({
     *   create: {
     *     // ... data to create a Pengawas
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Pengawas we want to update
     *   }
     * })
     */
    upsert<T extends PengawasUpsertArgs>(args: SelectSubset<T, PengawasUpsertArgs<ExtArgs>>): Prisma__PengawasClient<$Result.GetResult<Prisma.$PengawasPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Pengawas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PengawasCountArgs} args - Arguments to filter Pengawas to count.
     * @example
     * // Count the number of Pengawas
     * const count = await prisma.pengawas.count({
     *   where: {
     *     // ... the filter for the Pengawas we want to count
     *   }
     * })
    **/
    count<T extends PengawasCountArgs>(
      args?: Subset<T, PengawasCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PengawasCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Pengawas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PengawasAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PengawasAggregateArgs>(args: Subset<T, PengawasAggregateArgs>): Prisma.PrismaPromise<GetPengawasAggregateType<T>>

    /**
     * Group by Pengawas.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PengawasGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PengawasGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PengawasGroupByArgs['orderBy'] }
        : { orderBy?: PengawasGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PengawasGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPengawasGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Pengawas model
   */
  readonly fields: PengawasFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Pengawas.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PengawasClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    students<T extends Pengawas$studentsArgs<ExtArgs> = {}>(args?: Subset<T, Pengawas$studentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Pengawas model
   */
  interface PengawasFieldRefs {
    readonly id: FieldRef<"Pengawas", 'Int'>
    readonly username: FieldRef<"Pengawas", 'String'>
    readonly password: FieldRef<"Pengawas", 'String'>
    readonly name: FieldRef<"Pengawas", 'String'>
    readonly wilayah: FieldRef<"Pengawas", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Pengawas findUnique
   */
  export type PengawasFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pengawas
     */
    select?: PengawasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pengawas
     */
    omit?: PengawasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PengawasInclude<ExtArgs> | null
    /**
     * Filter, which Pengawas to fetch.
     */
    where: PengawasWhereUniqueInput
  }

  /**
   * Pengawas findUniqueOrThrow
   */
  export type PengawasFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pengawas
     */
    select?: PengawasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pengawas
     */
    omit?: PengawasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PengawasInclude<ExtArgs> | null
    /**
     * Filter, which Pengawas to fetch.
     */
    where: PengawasWhereUniqueInput
  }

  /**
   * Pengawas findFirst
   */
  export type PengawasFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pengawas
     */
    select?: PengawasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pengawas
     */
    omit?: PengawasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PengawasInclude<ExtArgs> | null
    /**
     * Filter, which Pengawas to fetch.
     */
    where?: PengawasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pengawas to fetch.
     */
    orderBy?: PengawasOrderByWithRelationInput | PengawasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pengawas.
     */
    cursor?: PengawasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pengawas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pengawas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pengawas.
     */
    distinct?: PengawasScalarFieldEnum | PengawasScalarFieldEnum[]
  }

  /**
   * Pengawas findFirstOrThrow
   */
  export type PengawasFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pengawas
     */
    select?: PengawasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pengawas
     */
    omit?: PengawasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PengawasInclude<ExtArgs> | null
    /**
     * Filter, which Pengawas to fetch.
     */
    where?: PengawasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pengawas to fetch.
     */
    orderBy?: PengawasOrderByWithRelationInput | PengawasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Pengawas.
     */
    cursor?: PengawasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pengawas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pengawas.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Pengawas.
     */
    distinct?: PengawasScalarFieldEnum | PengawasScalarFieldEnum[]
  }

  /**
   * Pengawas findMany
   */
  export type PengawasFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pengawas
     */
    select?: PengawasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pengawas
     */
    omit?: PengawasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PengawasInclude<ExtArgs> | null
    /**
     * Filter, which Pengawas to fetch.
     */
    where?: PengawasWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Pengawas to fetch.
     */
    orderBy?: PengawasOrderByWithRelationInput | PengawasOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Pengawas.
     */
    cursor?: PengawasWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Pengawas from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Pengawas.
     */
    skip?: number
    distinct?: PengawasScalarFieldEnum | PengawasScalarFieldEnum[]
  }

  /**
   * Pengawas create
   */
  export type PengawasCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pengawas
     */
    select?: PengawasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pengawas
     */
    omit?: PengawasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PengawasInclude<ExtArgs> | null
    /**
     * The data needed to create a Pengawas.
     */
    data: XOR<PengawasCreateInput, PengawasUncheckedCreateInput>
  }

  /**
   * Pengawas createMany
   */
  export type PengawasCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Pengawas.
     */
    data: PengawasCreateManyInput | PengawasCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Pengawas createManyAndReturn
   */
  export type PengawasCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pengawas
     */
    select?: PengawasSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Pengawas
     */
    omit?: PengawasOmit<ExtArgs> | null
    /**
     * The data used to create many Pengawas.
     */
    data: PengawasCreateManyInput | PengawasCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Pengawas update
   */
  export type PengawasUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pengawas
     */
    select?: PengawasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pengawas
     */
    omit?: PengawasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PengawasInclude<ExtArgs> | null
    /**
     * The data needed to update a Pengawas.
     */
    data: XOR<PengawasUpdateInput, PengawasUncheckedUpdateInput>
    /**
     * Choose, which Pengawas to update.
     */
    where: PengawasWhereUniqueInput
  }

  /**
   * Pengawas updateMany
   */
  export type PengawasUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Pengawas.
     */
    data: XOR<PengawasUpdateManyMutationInput, PengawasUncheckedUpdateManyInput>
    /**
     * Filter which Pengawas to update
     */
    where?: PengawasWhereInput
    /**
     * Limit how many Pengawas to update.
     */
    limit?: number
  }

  /**
   * Pengawas updateManyAndReturn
   */
  export type PengawasUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pengawas
     */
    select?: PengawasSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Pengawas
     */
    omit?: PengawasOmit<ExtArgs> | null
    /**
     * The data used to update Pengawas.
     */
    data: XOR<PengawasUpdateManyMutationInput, PengawasUncheckedUpdateManyInput>
    /**
     * Filter which Pengawas to update
     */
    where?: PengawasWhereInput
    /**
     * Limit how many Pengawas to update.
     */
    limit?: number
  }

  /**
   * Pengawas upsert
   */
  export type PengawasUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pengawas
     */
    select?: PengawasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pengawas
     */
    omit?: PengawasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PengawasInclude<ExtArgs> | null
    /**
     * The filter to search for the Pengawas to update in case it exists.
     */
    where: PengawasWhereUniqueInput
    /**
     * In case the Pengawas found by the `where` argument doesn't exist, create a new Pengawas with this data.
     */
    create: XOR<PengawasCreateInput, PengawasUncheckedCreateInput>
    /**
     * In case the Pengawas was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PengawasUpdateInput, PengawasUncheckedUpdateInput>
  }

  /**
   * Pengawas delete
   */
  export type PengawasDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pengawas
     */
    select?: PengawasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pengawas
     */
    omit?: PengawasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PengawasInclude<ExtArgs> | null
    /**
     * Filter which Pengawas to delete.
     */
    where: PengawasWhereUniqueInput
  }

  /**
   * Pengawas deleteMany
   */
  export type PengawasDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Pengawas to delete
     */
    where?: PengawasWhereInput
    /**
     * Limit how many Pengawas to delete.
     */
    limit?: number
  }

  /**
   * Pengawas.students
   */
  export type Pengawas$studentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    where?: StudentWhereInput
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    cursor?: StudentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: StudentScalarFieldEnum | StudentScalarFieldEnum[]
  }

  /**
   * Pengawas without action
   */
  export type PengawasDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Pengawas
     */
    select?: PengawasSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Pengawas
     */
    omit?: PengawasOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PengawasInclude<ExtArgs> | null
  }


  /**
   * Model Student
   */

  export type AggregateStudent = {
    _count: StudentCountAggregateOutputType | null
    _avg: StudentAvgAggregateOutputType | null
    _sum: StudentSumAggregateOutputType | null
    _min: StudentMinAggregateOutputType | null
    _max: StudentMaxAggregateOutputType | null
  }

  export type StudentAvgAggregateOutputType = {
    id: number | null
    pengawasId: number | null
    jumlahSaudara: number | null
  }

  export type StudentSumAggregateOutputType = {
    id: number | null
    pengawasId: number | null
    jumlahSaudara: number | null
  }

  export type StudentMinAggregateOutputType = {
    id: number | null
    username: string | null
    nik: string | null
    fullName: string | null
    dateOfBirth: Date | null
    gender: string | null
    citaCita: string | null
    wilayah: string | null
    pengawasId: number | null
    alamatLengkap: string | null
    noHp: string | null
    riwayatPenyakit: string | null
    schoolName: string | null
    gradeLevel: string | null
    nilaiRataRata: string | null
    jumlahSaudara: number | null
    createdAt: Date | null
  }

  export type StudentMaxAggregateOutputType = {
    id: number | null
    username: string | null
    nik: string | null
    fullName: string | null
    dateOfBirth: Date | null
    gender: string | null
    citaCita: string | null
    wilayah: string | null
    pengawasId: number | null
    alamatLengkap: string | null
    noHp: string | null
    riwayatPenyakit: string | null
    schoolName: string | null
    gradeLevel: string | null
    nilaiRataRata: string | null
    jumlahSaudara: number | null
    createdAt: Date | null
  }

  export type StudentCountAggregateOutputType = {
    id: number
    username: number
    nik: number
    fullName: number
    dateOfBirth: number
    gender: number
    citaCita: number
    wilayah: number
    pengawasId: number
    alamatLengkap: number
    noHp: number
    riwayatPenyakit: number
    schoolName: number
    gradeLevel: number
    nilaiRataRata: number
    jumlahSaudara: number
    createdAt: number
    _all: number
  }


  export type StudentAvgAggregateInputType = {
    id?: true
    pengawasId?: true
    jumlahSaudara?: true
  }

  export type StudentSumAggregateInputType = {
    id?: true
    pengawasId?: true
    jumlahSaudara?: true
  }

  export type StudentMinAggregateInputType = {
    id?: true
    username?: true
    nik?: true
    fullName?: true
    dateOfBirth?: true
    gender?: true
    citaCita?: true
    wilayah?: true
    pengawasId?: true
    alamatLengkap?: true
    noHp?: true
    riwayatPenyakit?: true
    schoolName?: true
    gradeLevel?: true
    nilaiRataRata?: true
    jumlahSaudara?: true
    createdAt?: true
  }

  export type StudentMaxAggregateInputType = {
    id?: true
    username?: true
    nik?: true
    fullName?: true
    dateOfBirth?: true
    gender?: true
    citaCita?: true
    wilayah?: true
    pengawasId?: true
    alamatLengkap?: true
    noHp?: true
    riwayatPenyakit?: true
    schoolName?: true
    gradeLevel?: true
    nilaiRataRata?: true
    jumlahSaudara?: true
    createdAt?: true
  }

  export type StudentCountAggregateInputType = {
    id?: true
    username?: true
    nik?: true
    fullName?: true
    dateOfBirth?: true
    gender?: true
    citaCita?: true
    wilayah?: true
    pengawasId?: true
    alamatLengkap?: true
    noHp?: true
    riwayatPenyakit?: true
    schoolName?: true
    gradeLevel?: true
    nilaiRataRata?: true
    jumlahSaudara?: true
    createdAt?: true
    _all?: true
  }

  export type StudentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Student to aggregate.
     */
    where?: StudentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Students to fetch.
     */
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: StudentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Students from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Students.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Students
    **/
    _count?: true | StudentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: StudentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: StudentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: StudentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: StudentMaxAggregateInputType
  }

  export type GetStudentAggregateType<T extends StudentAggregateArgs> = {
        [P in keyof T & keyof AggregateStudent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateStudent[P]>
      : GetScalarType<T[P], AggregateStudent[P]>
  }




  export type StudentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: StudentWhereInput
    orderBy?: StudentOrderByWithAggregationInput | StudentOrderByWithAggregationInput[]
    by: StudentScalarFieldEnum[] | StudentScalarFieldEnum
    having?: StudentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: StudentCountAggregateInputType | true
    _avg?: StudentAvgAggregateInputType
    _sum?: StudentSumAggregateInputType
    _min?: StudentMinAggregateInputType
    _max?: StudentMaxAggregateInputType
  }

  export type StudentGroupByOutputType = {
    id: number
    username: string
    nik: string
    fullName: string
    dateOfBirth: Date
    gender: string
    citaCita: string
    wilayah: string
    pengawasId: number
    alamatLengkap: string
    noHp: string
    riwayatPenyakit: string
    schoolName: string
    gradeLevel: string
    nilaiRataRata: string
    jumlahSaudara: number
    createdAt: Date
    _count: StudentCountAggregateOutputType | null
    _avg: StudentAvgAggregateOutputType | null
    _sum: StudentSumAggregateOutputType | null
    _min: StudentMinAggregateOutputType | null
    _max: StudentMaxAggregateOutputType | null
  }

  type GetStudentGroupByPayload<T extends StudentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<StudentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof StudentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], StudentGroupByOutputType[P]>
            : GetScalarType<T[P], StudentGroupByOutputType[P]>
        }
      >
    >


  export type StudentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    nik?: boolean
    fullName?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    citaCita?: boolean
    wilayah?: boolean
    pengawasId?: boolean
    alamatLengkap?: boolean
    noHp?: boolean
    riwayatPenyakit?: boolean
    schoolName?: boolean
    gradeLevel?: boolean
    nilaiRataRata?: boolean
    jumlahSaudara?: boolean
    createdAt?: boolean
    pengawas?: boolean | PengawasDefaultArgs<ExtArgs>
    father?: boolean | Student$fatherArgs<ExtArgs>
    mother?: boolean | Student$motherArgs<ExtArgs>
    guardian?: boolean | Student$guardianArgs<ExtArgs>
    educationCosts?: boolean | Student$educationCostsArgs<ExtArgs>
    documents?: boolean | Student$documentsArgs<ExtArgs>
    _count?: boolean | StudentCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["student"]>

  export type StudentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    nik?: boolean
    fullName?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    citaCita?: boolean
    wilayah?: boolean
    pengawasId?: boolean
    alamatLengkap?: boolean
    noHp?: boolean
    riwayatPenyakit?: boolean
    schoolName?: boolean
    gradeLevel?: boolean
    nilaiRataRata?: boolean
    jumlahSaudara?: boolean
    createdAt?: boolean
    pengawas?: boolean | PengawasDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["student"]>

  export type StudentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    nik?: boolean
    fullName?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    citaCita?: boolean
    wilayah?: boolean
    pengawasId?: boolean
    alamatLengkap?: boolean
    noHp?: boolean
    riwayatPenyakit?: boolean
    schoolName?: boolean
    gradeLevel?: boolean
    nilaiRataRata?: boolean
    jumlahSaudara?: boolean
    createdAt?: boolean
    pengawas?: boolean | PengawasDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["student"]>

  export type StudentSelectScalar = {
    id?: boolean
    username?: boolean
    nik?: boolean
    fullName?: boolean
    dateOfBirth?: boolean
    gender?: boolean
    citaCita?: boolean
    wilayah?: boolean
    pengawasId?: boolean
    alamatLengkap?: boolean
    noHp?: boolean
    riwayatPenyakit?: boolean
    schoolName?: boolean
    gradeLevel?: boolean
    nilaiRataRata?: boolean
    jumlahSaudara?: boolean
    createdAt?: boolean
  }

  export type StudentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "username" | "nik" | "fullName" | "dateOfBirth" | "gender" | "citaCita" | "wilayah" | "pengawasId" | "alamatLengkap" | "noHp" | "riwayatPenyakit" | "schoolName" | "gradeLevel" | "nilaiRataRata" | "jumlahSaudara" | "createdAt", ExtArgs["result"]["student"]>
  export type StudentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pengawas?: boolean | PengawasDefaultArgs<ExtArgs>
    father?: boolean | Student$fatherArgs<ExtArgs>
    mother?: boolean | Student$motherArgs<ExtArgs>
    guardian?: boolean | Student$guardianArgs<ExtArgs>
    educationCosts?: boolean | Student$educationCostsArgs<ExtArgs>
    documents?: boolean | Student$documentsArgs<ExtArgs>
    _count?: boolean | StudentCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type StudentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pengawas?: boolean | PengawasDefaultArgs<ExtArgs>
  }
  export type StudentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    pengawas?: boolean | PengawasDefaultArgs<ExtArgs>
  }

  export type $StudentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Student"
    objects: {
      pengawas: Prisma.$PengawasPayload<ExtArgs>
      father: Prisma.$FatherPayload<ExtArgs> | null
      mother: Prisma.$MotherPayload<ExtArgs> | null
      guardian: Prisma.$GuardianPayload<ExtArgs> | null
      educationCosts: Prisma.$EducationCostPayload<ExtArgs>[]
      documents: Prisma.$DocumentPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      username: string
      nik: string
      fullName: string
      dateOfBirth: Date
      gender: string
      citaCita: string
      wilayah: string
      pengawasId: number
      alamatLengkap: string
      noHp: string
      riwayatPenyakit: string
      schoolName: string
      gradeLevel: string
      nilaiRataRata: string
      jumlahSaudara: number
      createdAt: Date
    }, ExtArgs["result"]["student"]>
    composites: {}
  }

  type StudentGetPayload<S extends boolean | null | undefined | StudentDefaultArgs> = $Result.GetResult<Prisma.$StudentPayload, S>

  type StudentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<StudentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: StudentCountAggregateInputType | true
    }

  export interface StudentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Student'], meta: { name: 'Student' } }
    /**
     * Find zero or one Student that matches the filter.
     * @param {StudentFindUniqueArgs} args - Arguments to find a Student
     * @example
     * // Get one Student
     * const student = await prisma.student.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends StudentFindUniqueArgs>(args: SelectSubset<T, StudentFindUniqueArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Student that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {StudentFindUniqueOrThrowArgs} args - Arguments to find a Student
     * @example
     * // Get one Student
     * const student = await prisma.student.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends StudentFindUniqueOrThrowArgs>(args: SelectSubset<T, StudentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Student that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentFindFirstArgs} args - Arguments to find a Student
     * @example
     * // Get one Student
     * const student = await prisma.student.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends StudentFindFirstArgs>(args?: SelectSubset<T, StudentFindFirstArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Student that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentFindFirstOrThrowArgs} args - Arguments to find a Student
     * @example
     * // Get one Student
     * const student = await prisma.student.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends StudentFindFirstOrThrowArgs>(args?: SelectSubset<T, StudentFindFirstOrThrowArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Students that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Students
     * const students = await prisma.student.findMany()
     * 
     * // Get first 10 Students
     * const students = await prisma.student.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const studentWithIdOnly = await prisma.student.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends StudentFindManyArgs>(args?: SelectSubset<T, StudentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Student.
     * @param {StudentCreateArgs} args - Arguments to create a Student.
     * @example
     * // Create one Student
     * const Student = await prisma.student.create({
     *   data: {
     *     // ... data to create a Student
     *   }
     * })
     * 
     */
    create<T extends StudentCreateArgs>(args: SelectSubset<T, StudentCreateArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Students.
     * @param {StudentCreateManyArgs} args - Arguments to create many Students.
     * @example
     * // Create many Students
     * const student = await prisma.student.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends StudentCreateManyArgs>(args?: SelectSubset<T, StudentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Students and returns the data saved in the database.
     * @param {StudentCreateManyAndReturnArgs} args - Arguments to create many Students.
     * @example
     * // Create many Students
     * const student = await prisma.student.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Students and only return the `id`
     * const studentWithIdOnly = await prisma.student.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends StudentCreateManyAndReturnArgs>(args?: SelectSubset<T, StudentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Student.
     * @param {StudentDeleteArgs} args - Arguments to delete one Student.
     * @example
     * // Delete one Student
     * const Student = await prisma.student.delete({
     *   where: {
     *     // ... filter to delete one Student
     *   }
     * })
     * 
     */
    delete<T extends StudentDeleteArgs>(args: SelectSubset<T, StudentDeleteArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Student.
     * @param {StudentUpdateArgs} args - Arguments to update one Student.
     * @example
     * // Update one Student
     * const student = await prisma.student.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends StudentUpdateArgs>(args: SelectSubset<T, StudentUpdateArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Students.
     * @param {StudentDeleteManyArgs} args - Arguments to filter Students to delete.
     * @example
     * // Delete a few Students
     * const { count } = await prisma.student.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends StudentDeleteManyArgs>(args?: SelectSubset<T, StudentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Students.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Students
     * const student = await prisma.student.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends StudentUpdateManyArgs>(args: SelectSubset<T, StudentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Students and returns the data updated in the database.
     * @param {StudentUpdateManyAndReturnArgs} args - Arguments to update many Students.
     * @example
     * // Update many Students
     * const student = await prisma.student.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Students and only return the `id`
     * const studentWithIdOnly = await prisma.student.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends StudentUpdateManyAndReturnArgs>(args: SelectSubset<T, StudentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Student.
     * @param {StudentUpsertArgs} args - Arguments to update or create a Student.
     * @example
     * // Update or create a Student
     * const student = await prisma.student.upsert({
     *   create: {
     *     // ... data to create a Student
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Student we want to update
     *   }
     * })
     */
    upsert<T extends StudentUpsertArgs>(args: SelectSubset<T, StudentUpsertArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Students.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentCountArgs} args - Arguments to filter Students to count.
     * @example
     * // Count the number of Students
     * const count = await prisma.student.count({
     *   where: {
     *     // ... the filter for the Students we want to count
     *   }
     * })
    **/
    count<T extends StudentCountArgs>(
      args?: Subset<T, StudentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], StudentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Student.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends StudentAggregateArgs>(args: Subset<T, StudentAggregateArgs>): Prisma.PrismaPromise<GetStudentAggregateType<T>>

    /**
     * Group by Student.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {StudentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends StudentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: StudentGroupByArgs['orderBy'] }
        : { orderBy?: StudentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, StudentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStudentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Student model
   */
  readonly fields: StudentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Student.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__StudentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    pengawas<T extends PengawasDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PengawasDefaultArgs<ExtArgs>>): Prisma__PengawasClient<$Result.GetResult<Prisma.$PengawasPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    father<T extends Student$fatherArgs<ExtArgs> = {}>(args?: Subset<T, Student$fatherArgs<ExtArgs>>): Prisma__FatherClient<$Result.GetResult<Prisma.$FatherPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    mother<T extends Student$motherArgs<ExtArgs> = {}>(args?: Subset<T, Student$motherArgs<ExtArgs>>): Prisma__MotherClient<$Result.GetResult<Prisma.$MotherPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    guardian<T extends Student$guardianArgs<ExtArgs> = {}>(args?: Subset<T, Student$guardianArgs<ExtArgs>>): Prisma__GuardianClient<$Result.GetResult<Prisma.$GuardianPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    educationCosts<T extends Student$educationCostsArgs<ExtArgs> = {}>(args?: Subset<T, Student$educationCostsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EducationCostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    documents<T extends Student$documentsArgs<ExtArgs> = {}>(args?: Subset<T, Student$documentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Student model
   */
  interface StudentFieldRefs {
    readonly id: FieldRef<"Student", 'Int'>
    readonly username: FieldRef<"Student", 'String'>
    readonly nik: FieldRef<"Student", 'String'>
    readonly fullName: FieldRef<"Student", 'String'>
    readonly dateOfBirth: FieldRef<"Student", 'DateTime'>
    readonly gender: FieldRef<"Student", 'String'>
    readonly citaCita: FieldRef<"Student", 'String'>
    readonly wilayah: FieldRef<"Student", 'String'>
    readonly pengawasId: FieldRef<"Student", 'Int'>
    readonly alamatLengkap: FieldRef<"Student", 'String'>
    readonly noHp: FieldRef<"Student", 'String'>
    readonly riwayatPenyakit: FieldRef<"Student", 'String'>
    readonly schoolName: FieldRef<"Student", 'String'>
    readonly gradeLevel: FieldRef<"Student", 'String'>
    readonly nilaiRataRata: FieldRef<"Student", 'String'>
    readonly jumlahSaudara: FieldRef<"Student", 'Int'>
    readonly createdAt: FieldRef<"Student", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Student findUnique
   */
  export type StudentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter, which Student to fetch.
     */
    where: StudentWhereUniqueInput
  }

  /**
   * Student findUniqueOrThrow
   */
  export type StudentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter, which Student to fetch.
     */
    where: StudentWhereUniqueInput
  }

  /**
   * Student findFirst
   */
  export type StudentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter, which Student to fetch.
     */
    where?: StudentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Students to fetch.
     */
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Students.
     */
    cursor?: StudentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Students from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Students.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Students.
     */
    distinct?: StudentScalarFieldEnum | StudentScalarFieldEnum[]
  }

  /**
   * Student findFirstOrThrow
   */
  export type StudentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter, which Student to fetch.
     */
    where?: StudentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Students to fetch.
     */
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Students.
     */
    cursor?: StudentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Students from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Students.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Students.
     */
    distinct?: StudentScalarFieldEnum | StudentScalarFieldEnum[]
  }

  /**
   * Student findMany
   */
  export type StudentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter, which Students to fetch.
     */
    where?: StudentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Students to fetch.
     */
    orderBy?: StudentOrderByWithRelationInput | StudentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Students.
     */
    cursor?: StudentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Students from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Students.
     */
    skip?: number
    distinct?: StudentScalarFieldEnum | StudentScalarFieldEnum[]
  }

  /**
   * Student create
   */
  export type StudentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * The data needed to create a Student.
     */
    data: XOR<StudentCreateInput, StudentUncheckedCreateInput>
  }

  /**
   * Student createMany
   */
  export type StudentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Students.
     */
    data: StudentCreateManyInput | StudentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Student createManyAndReturn
   */
  export type StudentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * The data used to create many Students.
     */
    data: StudentCreateManyInput | StudentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Student update
   */
  export type StudentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * The data needed to update a Student.
     */
    data: XOR<StudentUpdateInput, StudentUncheckedUpdateInput>
    /**
     * Choose, which Student to update.
     */
    where: StudentWhereUniqueInput
  }

  /**
   * Student updateMany
   */
  export type StudentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Students.
     */
    data: XOR<StudentUpdateManyMutationInput, StudentUncheckedUpdateManyInput>
    /**
     * Filter which Students to update
     */
    where?: StudentWhereInput
    /**
     * Limit how many Students to update.
     */
    limit?: number
  }

  /**
   * Student updateManyAndReturn
   */
  export type StudentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * The data used to update Students.
     */
    data: XOR<StudentUpdateManyMutationInput, StudentUncheckedUpdateManyInput>
    /**
     * Filter which Students to update
     */
    where?: StudentWhereInput
    /**
     * Limit how many Students to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Student upsert
   */
  export type StudentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * The filter to search for the Student to update in case it exists.
     */
    where: StudentWhereUniqueInput
    /**
     * In case the Student found by the `where` argument doesn't exist, create a new Student with this data.
     */
    create: XOR<StudentCreateInput, StudentUncheckedCreateInput>
    /**
     * In case the Student was found with the provided `where` argument, update it with this data.
     */
    update: XOR<StudentUpdateInput, StudentUncheckedUpdateInput>
  }

  /**
   * Student delete
   */
  export type StudentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
    /**
     * Filter which Student to delete.
     */
    where: StudentWhereUniqueInput
  }

  /**
   * Student deleteMany
   */
  export type StudentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Students to delete
     */
    where?: StudentWhereInput
    /**
     * Limit how many Students to delete.
     */
    limit?: number
  }

  /**
   * Student.father
   */
  export type Student$fatherArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Father
     */
    select?: FatherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Father
     */
    omit?: FatherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FatherInclude<ExtArgs> | null
    where?: FatherWhereInput
  }

  /**
   * Student.mother
   */
  export type Student$motherArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mother
     */
    select?: MotherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mother
     */
    omit?: MotherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherInclude<ExtArgs> | null
    where?: MotherWhereInput
  }

  /**
   * Student.guardian
   */
  export type Student$guardianArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guardian
     */
    select?: GuardianSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guardian
     */
    omit?: GuardianOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuardianInclude<ExtArgs> | null
    where?: GuardianWhereInput
  }

  /**
   * Student.educationCosts
   */
  export type Student$educationCostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EducationCost
     */
    select?: EducationCostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EducationCost
     */
    omit?: EducationCostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationCostInclude<ExtArgs> | null
    where?: EducationCostWhereInput
    orderBy?: EducationCostOrderByWithRelationInput | EducationCostOrderByWithRelationInput[]
    cursor?: EducationCostWhereUniqueInput
    take?: number
    skip?: number
    distinct?: EducationCostScalarFieldEnum | EducationCostScalarFieldEnum[]
  }

  /**
   * Student.documents
   */
  export type Student$documentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    where?: DocumentWhereInput
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    cursor?: DocumentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Student without action
   */
  export type StudentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Student
     */
    select?: StudentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Student
     */
    omit?: StudentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: StudentInclude<ExtArgs> | null
  }


  /**
   * Model EducationCost
   */

  export type AggregateEducationCost = {
    _count: EducationCostCountAggregateOutputType | null
    _avg: EducationCostAvgAggregateOutputType | null
    _sum: EducationCostSumAggregateOutputType | null
    _min: EducationCostMinAggregateOutputType | null
    _max: EducationCostMaxAggregateOutputType | null
  }

  export type EducationCostAvgAggregateOutputType = {
    id: number | null
    studentId: number | null
    amount: number | null
  }

  export type EducationCostSumAggregateOutputType = {
    id: number | null
    studentId: number | null
    amount: number | null
  }

  export type EducationCostMinAggregateOutputType = {
    id: number | null
    studentId: number | null
    label: string | null
    amount: number | null
  }

  export type EducationCostMaxAggregateOutputType = {
    id: number | null
    studentId: number | null
    label: string | null
    amount: number | null
  }

  export type EducationCostCountAggregateOutputType = {
    id: number
    studentId: number
    label: number
    amount: number
    _all: number
  }


  export type EducationCostAvgAggregateInputType = {
    id?: true
    studentId?: true
    amount?: true
  }

  export type EducationCostSumAggregateInputType = {
    id?: true
    studentId?: true
    amount?: true
  }

  export type EducationCostMinAggregateInputType = {
    id?: true
    studentId?: true
    label?: true
    amount?: true
  }

  export type EducationCostMaxAggregateInputType = {
    id?: true
    studentId?: true
    label?: true
    amount?: true
  }

  export type EducationCostCountAggregateInputType = {
    id?: true
    studentId?: true
    label?: true
    amount?: true
    _all?: true
  }

  export type EducationCostAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EducationCost to aggregate.
     */
    where?: EducationCostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EducationCosts to fetch.
     */
    orderBy?: EducationCostOrderByWithRelationInput | EducationCostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: EducationCostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EducationCosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EducationCosts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned EducationCosts
    **/
    _count?: true | EducationCostCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: EducationCostAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: EducationCostSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: EducationCostMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: EducationCostMaxAggregateInputType
  }

  export type GetEducationCostAggregateType<T extends EducationCostAggregateArgs> = {
        [P in keyof T & keyof AggregateEducationCost]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateEducationCost[P]>
      : GetScalarType<T[P], AggregateEducationCost[P]>
  }




  export type EducationCostGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: EducationCostWhereInput
    orderBy?: EducationCostOrderByWithAggregationInput | EducationCostOrderByWithAggregationInput[]
    by: EducationCostScalarFieldEnum[] | EducationCostScalarFieldEnum
    having?: EducationCostScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: EducationCostCountAggregateInputType | true
    _avg?: EducationCostAvgAggregateInputType
    _sum?: EducationCostSumAggregateInputType
    _min?: EducationCostMinAggregateInputType
    _max?: EducationCostMaxAggregateInputType
  }

  export type EducationCostGroupByOutputType = {
    id: number
    studentId: number
    label: string
    amount: number
    _count: EducationCostCountAggregateOutputType | null
    _avg: EducationCostAvgAggregateOutputType | null
    _sum: EducationCostSumAggregateOutputType | null
    _min: EducationCostMinAggregateOutputType | null
    _max: EducationCostMaxAggregateOutputType | null
  }

  type GetEducationCostGroupByPayload<T extends EducationCostGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<EducationCostGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof EducationCostGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], EducationCostGroupByOutputType[P]>
            : GetScalarType<T[P], EducationCostGroupByOutputType[P]>
        }
      >
    >


  export type EducationCostSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    label?: boolean
    amount?: boolean
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["educationCost"]>

  export type EducationCostSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    label?: boolean
    amount?: boolean
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["educationCost"]>

  export type EducationCostSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    label?: boolean
    amount?: boolean
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["educationCost"]>

  export type EducationCostSelectScalar = {
    id?: boolean
    studentId?: boolean
    label?: boolean
    amount?: boolean
  }

  export type EducationCostOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "studentId" | "label" | "amount", ExtArgs["result"]["educationCost"]>
  export type EducationCostInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }
  export type EducationCostIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }
  export type EducationCostIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }

  export type $EducationCostPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "EducationCost"
    objects: {
      student: Prisma.$StudentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      studentId: number
      label: string
      amount: number
    }, ExtArgs["result"]["educationCost"]>
    composites: {}
  }

  type EducationCostGetPayload<S extends boolean | null | undefined | EducationCostDefaultArgs> = $Result.GetResult<Prisma.$EducationCostPayload, S>

  type EducationCostCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<EducationCostFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: EducationCostCountAggregateInputType | true
    }

  export interface EducationCostDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['EducationCost'], meta: { name: 'EducationCost' } }
    /**
     * Find zero or one EducationCost that matches the filter.
     * @param {EducationCostFindUniqueArgs} args - Arguments to find a EducationCost
     * @example
     * // Get one EducationCost
     * const educationCost = await prisma.educationCost.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends EducationCostFindUniqueArgs>(args: SelectSubset<T, EducationCostFindUniqueArgs<ExtArgs>>): Prisma__EducationCostClient<$Result.GetResult<Prisma.$EducationCostPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one EducationCost that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {EducationCostFindUniqueOrThrowArgs} args - Arguments to find a EducationCost
     * @example
     * // Get one EducationCost
     * const educationCost = await prisma.educationCost.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends EducationCostFindUniqueOrThrowArgs>(args: SelectSubset<T, EducationCostFindUniqueOrThrowArgs<ExtArgs>>): Prisma__EducationCostClient<$Result.GetResult<Prisma.$EducationCostPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EducationCost that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EducationCostFindFirstArgs} args - Arguments to find a EducationCost
     * @example
     * // Get one EducationCost
     * const educationCost = await prisma.educationCost.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends EducationCostFindFirstArgs>(args?: SelectSubset<T, EducationCostFindFirstArgs<ExtArgs>>): Prisma__EducationCostClient<$Result.GetResult<Prisma.$EducationCostPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first EducationCost that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EducationCostFindFirstOrThrowArgs} args - Arguments to find a EducationCost
     * @example
     * // Get one EducationCost
     * const educationCost = await prisma.educationCost.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends EducationCostFindFirstOrThrowArgs>(args?: SelectSubset<T, EducationCostFindFirstOrThrowArgs<ExtArgs>>): Prisma__EducationCostClient<$Result.GetResult<Prisma.$EducationCostPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more EducationCosts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EducationCostFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all EducationCosts
     * const educationCosts = await prisma.educationCost.findMany()
     * 
     * // Get first 10 EducationCosts
     * const educationCosts = await prisma.educationCost.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const educationCostWithIdOnly = await prisma.educationCost.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends EducationCostFindManyArgs>(args?: SelectSubset<T, EducationCostFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EducationCostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a EducationCost.
     * @param {EducationCostCreateArgs} args - Arguments to create a EducationCost.
     * @example
     * // Create one EducationCost
     * const EducationCost = await prisma.educationCost.create({
     *   data: {
     *     // ... data to create a EducationCost
     *   }
     * })
     * 
     */
    create<T extends EducationCostCreateArgs>(args: SelectSubset<T, EducationCostCreateArgs<ExtArgs>>): Prisma__EducationCostClient<$Result.GetResult<Prisma.$EducationCostPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many EducationCosts.
     * @param {EducationCostCreateManyArgs} args - Arguments to create many EducationCosts.
     * @example
     * // Create many EducationCosts
     * const educationCost = await prisma.educationCost.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends EducationCostCreateManyArgs>(args?: SelectSubset<T, EducationCostCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many EducationCosts and returns the data saved in the database.
     * @param {EducationCostCreateManyAndReturnArgs} args - Arguments to create many EducationCosts.
     * @example
     * // Create many EducationCosts
     * const educationCost = await prisma.educationCost.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many EducationCosts and only return the `id`
     * const educationCostWithIdOnly = await prisma.educationCost.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends EducationCostCreateManyAndReturnArgs>(args?: SelectSubset<T, EducationCostCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EducationCostPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a EducationCost.
     * @param {EducationCostDeleteArgs} args - Arguments to delete one EducationCost.
     * @example
     * // Delete one EducationCost
     * const EducationCost = await prisma.educationCost.delete({
     *   where: {
     *     // ... filter to delete one EducationCost
     *   }
     * })
     * 
     */
    delete<T extends EducationCostDeleteArgs>(args: SelectSubset<T, EducationCostDeleteArgs<ExtArgs>>): Prisma__EducationCostClient<$Result.GetResult<Prisma.$EducationCostPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one EducationCost.
     * @param {EducationCostUpdateArgs} args - Arguments to update one EducationCost.
     * @example
     * // Update one EducationCost
     * const educationCost = await prisma.educationCost.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends EducationCostUpdateArgs>(args: SelectSubset<T, EducationCostUpdateArgs<ExtArgs>>): Prisma__EducationCostClient<$Result.GetResult<Prisma.$EducationCostPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more EducationCosts.
     * @param {EducationCostDeleteManyArgs} args - Arguments to filter EducationCosts to delete.
     * @example
     * // Delete a few EducationCosts
     * const { count } = await prisma.educationCost.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends EducationCostDeleteManyArgs>(args?: SelectSubset<T, EducationCostDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EducationCosts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EducationCostUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many EducationCosts
     * const educationCost = await prisma.educationCost.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends EducationCostUpdateManyArgs>(args: SelectSubset<T, EducationCostUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more EducationCosts and returns the data updated in the database.
     * @param {EducationCostUpdateManyAndReturnArgs} args - Arguments to update many EducationCosts.
     * @example
     * // Update many EducationCosts
     * const educationCost = await prisma.educationCost.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more EducationCosts and only return the `id`
     * const educationCostWithIdOnly = await prisma.educationCost.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends EducationCostUpdateManyAndReturnArgs>(args: SelectSubset<T, EducationCostUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$EducationCostPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one EducationCost.
     * @param {EducationCostUpsertArgs} args - Arguments to update or create a EducationCost.
     * @example
     * // Update or create a EducationCost
     * const educationCost = await prisma.educationCost.upsert({
     *   create: {
     *     // ... data to create a EducationCost
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the EducationCost we want to update
     *   }
     * })
     */
    upsert<T extends EducationCostUpsertArgs>(args: SelectSubset<T, EducationCostUpsertArgs<ExtArgs>>): Prisma__EducationCostClient<$Result.GetResult<Prisma.$EducationCostPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of EducationCosts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EducationCostCountArgs} args - Arguments to filter EducationCosts to count.
     * @example
     * // Count the number of EducationCosts
     * const count = await prisma.educationCost.count({
     *   where: {
     *     // ... the filter for the EducationCosts we want to count
     *   }
     * })
    **/
    count<T extends EducationCostCountArgs>(
      args?: Subset<T, EducationCostCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], EducationCostCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a EducationCost.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EducationCostAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends EducationCostAggregateArgs>(args: Subset<T, EducationCostAggregateArgs>): Prisma.PrismaPromise<GetEducationCostAggregateType<T>>

    /**
     * Group by EducationCost.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {EducationCostGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends EducationCostGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: EducationCostGroupByArgs['orderBy'] }
        : { orderBy?: EducationCostGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, EducationCostGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEducationCostGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the EducationCost model
   */
  readonly fields: EducationCostFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for EducationCost.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__EducationCostClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    student<T extends StudentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StudentDefaultArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the EducationCost model
   */
  interface EducationCostFieldRefs {
    readonly id: FieldRef<"EducationCost", 'Int'>
    readonly studentId: FieldRef<"EducationCost", 'Int'>
    readonly label: FieldRef<"EducationCost", 'String'>
    readonly amount: FieldRef<"EducationCost", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * EducationCost findUnique
   */
  export type EducationCostFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EducationCost
     */
    select?: EducationCostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EducationCost
     */
    omit?: EducationCostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationCostInclude<ExtArgs> | null
    /**
     * Filter, which EducationCost to fetch.
     */
    where: EducationCostWhereUniqueInput
  }

  /**
   * EducationCost findUniqueOrThrow
   */
  export type EducationCostFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EducationCost
     */
    select?: EducationCostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EducationCost
     */
    omit?: EducationCostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationCostInclude<ExtArgs> | null
    /**
     * Filter, which EducationCost to fetch.
     */
    where: EducationCostWhereUniqueInput
  }

  /**
   * EducationCost findFirst
   */
  export type EducationCostFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EducationCost
     */
    select?: EducationCostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EducationCost
     */
    omit?: EducationCostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationCostInclude<ExtArgs> | null
    /**
     * Filter, which EducationCost to fetch.
     */
    where?: EducationCostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EducationCosts to fetch.
     */
    orderBy?: EducationCostOrderByWithRelationInput | EducationCostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EducationCosts.
     */
    cursor?: EducationCostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EducationCosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EducationCosts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EducationCosts.
     */
    distinct?: EducationCostScalarFieldEnum | EducationCostScalarFieldEnum[]
  }

  /**
   * EducationCost findFirstOrThrow
   */
  export type EducationCostFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EducationCost
     */
    select?: EducationCostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EducationCost
     */
    omit?: EducationCostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationCostInclude<ExtArgs> | null
    /**
     * Filter, which EducationCost to fetch.
     */
    where?: EducationCostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EducationCosts to fetch.
     */
    orderBy?: EducationCostOrderByWithRelationInput | EducationCostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for EducationCosts.
     */
    cursor?: EducationCostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EducationCosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EducationCosts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of EducationCosts.
     */
    distinct?: EducationCostScalarFieldEnum | EducationCostScalarFieldEnum[]
  }

  /**
   * EducationCost findMany
   */
  export type EducationCostFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EducationCost
     */
    select?: EducationCostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EducationCost
     */
    omit?: EducationCostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationCostInclude<ExtArgs> | null
    /**
     * Filter, which EducationCosts to fetch.
     */
    where?: EducationCostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of EducationCosts to fetch.
     */
    orderBy?: EducationCostOrderByWithRelationInput | EducationCostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing EducationCosts.
     */
    cursor?: EducationCostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` EducationCosts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` EducationCosts.
     */
    skip?: number
    distinct?: EducationCostScalarFieldEnum | EducationCostScalarFieldEnum[]
  }

  /**
   * EducationCost create
   */
  export type EducationCostCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EducationCost
     */
    select?: EducationCostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EducationCost
     */
    omit?: EducationCostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationCostInclude<ExtArgs> | null
    /**
     * The data needed to create a EducationCost.
     */
    data: XOR<EducationCostCreateInput, EducationCostUncheckedCreateInput>
  }

  /**
   * EducationCost createMany
   */
  export type EducationCostCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many EducationCosts.
     */
    data: EducationCostCreateManyInput | EducationCostCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * EducationCost createManyAndReturn
   */
  export type EducationCostCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EducationCost
     */
    select?: EducationCostSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EducationCost
     */
    omit?: EducationCostOmit<ExtArgs> | null
    /**
     * The data used to create many EducationCosts.
     */
    data: EducationCostCreateManyInput | EducationCostCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationCostIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * EducationCost update
   */
  export type EducationCostUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EducationCost
     */
    select?: EducationCostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EducationCost
     */
    omit?: EducationCostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationCostInclude<ExtArgs> | null
    /**
     * The data needed to update a EducationCost.
     */
    data: XOR<EducationCostUpdateInput, EducationCostUncheckedUpdateInput>
    /**
     * Choose, which EducationCost to update.
     */
    where: EducationCostWhereUniqueInput
  }

  /**
   * EducationCost updateMany
   */
  export type EducationCostUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update EducationCosts.
     */
    data: XOR<EducationCostUpdateManyMutationInput, EducationCostUncheckedUpdateManyInput>
    /**
     * Filter which EducationCosts to update
     */
    where?: EducationCostWhereInput
    /**
     * Limit how many EducationCosts to update.
     */
    limit?: number
  }

  /**
   * EducationCost updateManyAndReturn
   */
  export type EducationCostUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EducationCost
     */
    select?: EducationCostSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the EducationCost
     */
    omit?: EducationCostOmit<ExtArgs> | null
    /**
     * The data used to update EducationCosts.
     */
    data: XOR<EducationCostUpdateManyMutationInput, EducationCostUncheckedUpdateManyInput>
    /**
     * Filter which EducationCosts to update
     */
    where?: EducationCostWhereInput
    /**
     * Limit how many EducationCosts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationCostIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * EducationCost upsert
   */
  export type EducationCostUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EducationCost
     */
    select?: EducationCostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EducationCost
     */
    omit?: EducationCostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationCostInclude<ExtArgs> | null
    /**
     * The filter to search for the EducationCost to update in case it exists.
     */
    where: EducationCostWhereUniqueInput
    /**
     * In case the EducationCost found by the `where` argument doesn't exist, create a new EducationCost with this data.
     */
    create: XOR<EducationCostCreateInput, EducationCostUncheckedCreateInput>
    /**
     * In case the EducationCost was found with the provided `where` argument, update it with this data.
     */
    update: XOR<EducationCostUpdateInput, EducationCostUncheckedUpdateInput>
  }

  /**
   * EducationCost delete
   */
  export type EducationCostDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EducationCost
     */
    select?: EducationCostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EducationCost
     */
    omit?: EducationCostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationCostInclude<ExtArgs> | null
    /**
     * Filter which EducationCost to delete.
     */
    where: EducationCostWhereUniqueInput
  }

  /**
   * EducationCost deleteMany
   */
  export type EducationCostDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which EducationCosts to delete
     */
    where?: EducationCostWhereInput
    /**
     * Limit how many EducationCosts to delete.
     */
    limit?: number
  }

  /**
   * EducationCost without action
   */
  export type EducationCostDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the EducationCost
     */
    select?: EducationCostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the EducationCost
     */
    omit?: EducationCostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: EducationCostInclude<ExtArgs> | null
  }


  /**
   * Model Father
   */

  export type AggregateFather = {
    _count: FatherCountAggregateOutputType | null
    _avg: FatherAvgAggregateOutputType | null
    _sum: FatherSumAggregateOutputType | null
    _min: FatherMinAggregateOutputType | null
    _max: FatherMaxAggregateOutputType | null
  }

  export type FatherAvgAggregateOutputType = {
    id: number | null
    studentId: number | null
  }

  export type FatherSumAggregateOutputType = {
    id: number | null
    studentId: number | null
  }

  export type FatherMinAggregateOutputType = {
    id: number | null
    studentId: number | null
    name: string | null
    status: string | null
    occupation: string | null
    incomePerMonth: string | null
    address: string | null
    phone: string | null
    medicalHistory: string | null
  }

  export type FatherMaxAggregateOutputType = {
    id: number | null
    studentId: number | null
    name: string | null
    status: string | null
    occupation: string | null
    incomePerMonth: string | null
    address: string | null
    phone: string | null
    medicalHistory: string | null
  }

  export type FatherCountAggregateOutputType = {
    id: number
    studentId: number
    name: number
    status: number
    occupation: number
    incomePerMonth: number
    address: number
    phone: number
    medicalHistory: number
    _all: number
  }


  export type FatherAvgAggregateInputType = {
    id?: true
    studentId?: true
  }

  export type FatherSumAggregateInputType = {
    id?: true
    studentId?: true
  }

  export type FatherMinAggregateInputType = {
    id?: true
    studentId?: true
    name?: true
    status?: true
    occupation?: true
    incomePerMonth?: true
    address?: true
    phone?: true
    medicalHistory?: true
  }

  export type FatherMaxAggregateInputType = {
    id?: true
    studentId?: true
    name?: true
    status?: true
    occupation?: true
    incomePerMonth?: true
    address?: true
    phone?: true
    medicalHistory?: true
  }

  export type FatherCountAggregateInputType = {
    id?: true
    studentId?: true
    name?: true
    status?: true
    occupation?: true
    incomePerMonth?: true
    address?: true
    phone?: true
    medicalHistory?: true
    _all?: true
  }

  export type FatherAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Father to aggregate.
     */
    where?: FatherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Fathers to fetch.
     */
    orderBy?: FatherOrderByWithRelationInput | FatherOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: FatherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Fathers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Fathers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Fathers
    **/
    _count?: true | FatherCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: FatherAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: FatherSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: FatherMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: FatherMaxAggregateInputType
  }

  export type GetFatherAggregateType<T extends FatherAggregateArgs> = {
        [P in keyof T & keyof AggregateFather]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateFather[P]>
      : GetScalarType<T[P], AggregateFather[P]>
  }




  export type FatherGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: FatherWhereInput
    orderBy?: FatherOrderByWithAggregationInput | FatherOrderByWithAggregationInput[]
    by: FatherScalarFieldEnum[] | FatherScalarFieldEnum
    having?: FatherScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: FatherCountAggregateInputType | true
    _avg?: FatherAvgAggregateInputType
    _sum?: FatherSumAggregateInputType
    _min?: FatherMinAggregateInputType
    _max?: FatherMaxAggregateInputType
  }

  export type FatherGroupByOutputType = {
    id: number
    studentId: number
    name: string
    status: string
    occupation: string
    incomePerMonth: string
    address: string
    phone: string
    medicalHistory: string
    _count: FatherCountAggregateOutputType | null
    _avg: FatherAvgAggregateOutputType | null
    _sum: FatherSumAggregateOutputType | null
    _min: FatherMinAggregateOutputType | null
    _max: FatherMaxAggregateOutputType | null
  }

  type GetFatherGroupByPayload<T extends FatherGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<FatherGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof FatherGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], FatherGroupByOutputType[P]>
            : GetScalarType<T[P], FatherGroupByOutputType[P]>
        }
      >
    >


  export type FatherSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    name?: boolean
    status?: boolean
    occupation?: boolean
    incomePerMonth?: boolean
    address?: boolean
    phone?: boolean
    medicalHistory?: boolean
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["father"]>

  export type FatherSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    name?: boolean
    status?: boolean
    occupation?: boolean
    incomePerMonth?: boolean
    address?: boolean
    phone?: boolean
    medicalHistory?: boolean
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["father"]>

  export type FatherSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    name?: boolean
    status?: boolean
    occupation?: boolean
    incomePerMonth?: boolean
    address?: boolean
    phone?: boolean
    medicalHistory?: boolean
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["father"]>

  export type FatherSelectScalar = {
    id?: boolean
    studentId?: boolean
    name?: boolean
    status?: boolean
    occupation?: boolean
    incomePerMonth?: boolean
    address?: boolean
    phone?: boolean
    medicalHistory?: boolean
  }

  export type FatherOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "studentId" | "name" | "status" | "occupation" | "incomePerMonth" | "address" | "phone" | "medicalHistory", ExtArgs["result"]["father"]>
  export type FatherInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }
  export type FatherIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }
  export type FatherIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }

  export type $FatherPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Father"
    objects: {
      student: Prisma.$StudentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      studentId: number
      name: string
      status: string
      occupation: string
      incomePerMonth: string
      address: string
      phone: string
      medicalHistory: string
    }, ExtArgs["result"]["father"]>
    composites: {}
  }

  type FatherGetPayload<S extends boolean | null | undefined | FatherDefaultArgs> = $Result.GetResult<Prisma.$FatherPayload, S>

  type FatherCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<FatherFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: FatherCountAggregateInputType | true
    }

  export interface FatherDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Father'], meta: { name: 'Father' } }
    /**
     * Find zero or one Father that matches the filter.
     * @param {FatherFindUniqueArgs} args - Arguments to find a Father
     * @example
     * // Get one Father
     * const father = await prisma.father.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends FatherFindUniqueArgs>(args: SelectSubset<T, FatherFindUniqueArgs<ExtArgs>>): Prisma__FatherClient<$Result.GetResult<Prisma.$FatherPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Father that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {FatherFindUniqueOrThrowArgs} args - Arguments to find a Father
     * @example
     * // Get one Father
     * const father = await prisma.father.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends FatherFindUniqueOrThrowArgs>(args: SelectSubset<T, FatherFindUniqueOrThrowArgs<ExtArgs>>): Prisma__FatherClient<$Result.GetResult<Prisma.$FatherPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Father that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FatherFindFirstArgs} args - Arguments to find a Father
     * @example
     * // Get one Father
     * const father = await prisma.father.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends FatherFindFirstArgs>(args?: SelectSubset<T, FatherFindFirstArgs<ExtArgs>>): Prisma__FatherClient<$Result.GetResult<Prisma.$FatherPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Father that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FatherFindFirstOrThrowArgs} args - Arguments to find a Father
     * @example
     * // Get one Father
     * const father = await prisma.father.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends FatherFindFirstOrThrowArgs>(args?: SelectSubset<T, FatherFindFirstOrThrowArgs<ExtArgs>>): Prisma__FatherClient<$Result.GetResult<Prisma.$FatherPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Fathers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FatherFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Fathers
     * const fathers = await prisma.father.findMany()
     * 
     * // Get first 10 Fathers
     * const fathers = await prisma.father.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const fatherWithIdOnly = await prisma.father.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends FatherFindManyArgs>(args?: SelectSubset<T, FatherFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FatherPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Father.
     * @param {FatherCreateArgs} args - Arguments to create a Father.
     * @example
     * // Create one Father
     * const Father = await prisma.father.create({
     *   data: {
     *     // ... data to create a Father
     *   }
     * })
     * 
     */
    create<T extends FatherCreateArgs>(args: SelectSubset<T, FatherCreateArgs<ExtArgs>>): Prisma__FatherClient<$Result.GetResult<Prisma.$FatherPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Fathers.
     * @param {FatherCreateManyArgs} args - Arguments to create many Fathers.
     * @example
     * // Create many Fathers
     * const father = await prisma.father.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends FatherCreateManyArgs>(args?: SelectSubset<T, FatherCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Fathers and returns the data saved in the database.
     * @param {FatherCreateManyAndReturnArgs} args - Arguments to create many Fathers.
     * @example
     * // Create many Fathers
     * const father = await prisma.father.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Fathers and only return the `id`
     * const fatherWithIdOnly = await prisma.father.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends FatherCreateManyAndReturnArgs>(args?: SelectSubset<T, FatherCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FatherPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Father.
     * @param {FatherDeleteArgs} args - Arguments to delete one Father.
     * @example
     * // Delete one Father
     * const Father = await prisma.father.delete({
     *   where: {
     *     // ... filter to delete one Father
     *   }
     * })
     * 
     */
    delete<T extends FatherDeleteArgs>(args: SelectSubset<T, FatherDeleteArgs<ExtArgs>>): Prisma__FatherClient<$Result.GetResult<Prisma.$FatherPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Father.
     * @param {FatherUpdateArgs} args - Arguments to update one Father.
     * @example
     * // Update one Father
     * const father = await prisma.father.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends FatherUpdateArgs>(args: SelectSubset<T, FatherUpdateArgs<ExtArgs>>): Prisma__FatherClient<$Result.GetResult<Prisma.$FatherPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Fathers.
     * @param {FatherDeleteManyArgs} args - Arguments to filter Fathers to delete.
     * @example
     * // Delete a few Fathers
     * const { count } = await prisma.father.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends FatherDeleteManyArgs>(args?: SelectSubset<T, FatherDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Fathers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FatherUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Fathers
     * const father = await prisma.father.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends FatherUpdateManyArgs>(args: SelectSubset<T, FatherUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Fathers and returns the data updated in the database.
     * @param {FatherUpdateManyAndReturnArgs} args - Arguments to update many Fathers.
     * @example
     * // Update many Fathers
     * const father = await prisma.father.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Fathers and only return the `id`
     * const fatherWithIdOnly = await prisma.father.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends FatherUpdateManyAndReturnArgs>(args: SelectSubset<T, FatherUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$FatherPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Father.
     * @param {FatherUpsertArgs} args - Arguments to update or create a Father.
     * @example
     * // Update or create a Father
     * const father = await prisma.father.upsert({
     *   create: {
     *     // ... data to create a Father
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Father we want to update
     *   }
     * })
     */
    upsert<T extends FatherUpsertArgs>(args: SelectSubset<T, FatherUpsertArgs<ExtArgs>>): Prisma__FatherClient<$Result.GetResult<Prisma.$FatherPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Fathers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FatherCountArgs} args - Arguments to filter Fathers to count.
     * @example
     * // Count the number of Fathers
     * const count = await prisma.father.count({
     *   where: {
     *     // ... the filter for the Fathers we want to count
     *   }
     * })
    **/
    count<T extends FatherCountArgs>(
      args?: Subset<T, FatherCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], FatherCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Father.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FatherAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends FatherAggregateArgs>(args: Subset<T, FatherAggregateArgs>): Prisma.PrismaPromise<GetFatherAggregateType<T>>

    /**
     * Group by Father.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {FatherGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends FatherGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: FatherGroupByArgs['orderBy'] }
        : { orderBy?: FatherGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, FatherGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFatherGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Father model
   */
  readonly fields: FatherFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Father.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__FatherClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    student<T extends StudentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StudentDefaultArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Father model
   */
  interface FatherFieldRefs {
    readonly id: FieldRef<"Father", 'Int'>
    readonly studentId: FieldRef<"Father", 'Int'>
    readonly name: FieldRef<"Father", 'String'>
    readonly status: FieldRef<"Father", 'String'>
    readonly occupation: FieldRef<"Father", 'String'>
    readonly incomePerMonth: FieldRef<"Father", 'String'>
    readonly address: FieldRef<"Father", 'String'>
    readonly phone: FieldRef<"Father", 'String'>
    readonly medicalHistory: FieldRef<"Father", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Father findUnique
   */
  export type FatherFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Father
     */
    select?: FatherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Father
     */
    omit?: FatherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FatherInclude<ExtArgs> | null
    /**
     * Filter, which Father to fetch.
     */
    where: FatherWhereUniqueInput
  }

  /**
   * Father findUniqueOrThrow
   */
  export type FatherFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Father
     */
    select?: FatherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Father
     */
    omit?: FatherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FatherInclude<ExtArgs> | null
    /**
     * Filter, which Father to fetch.
     */
    where: FatherWhereUniqueInput
  }

  /**
   * Father findFirst
   */
  export type FatherFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Father
     */
    select?: FatherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Father
     */
    omit?: FatherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FatherInclude<ExtArgs> | null
    /**
     * Filter, which Father to fetch.
     */
    where?: FatherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Fathers to fetch.
     */
    orderBy?: FatherOrderByWithRelationInput | FatherOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Fathers.
     */
    cursor?: FatherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Fathers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Fathers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Fathers.
     */
    distinct?: FatherScalarFieldEnum | FatherScalarFieldEnum[]
  }

  /**
   * Father findFirstOrThrow
   */
  export type FatherFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Father
     */
    select?: FatherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Father
     */
    omit?: FatherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FatherInclude<ExtArgs> | null
    /**
     * Filter, which Father to fetch.
     */
    where?: FatherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Fathers to fetch.
     */
    orderBy?: FatherOrderByWithRelationInput | FatherOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Fathers.
     */
    cursor?: FatherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Fathers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Fathers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Fathers.
     */
    distinct?: FatherScalarFieldEnum | FatherScalarFieldEnum[]
  }

  /**
   * Father findMany
   */
  export type FatherFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Father
     */
    select?: FatherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Father
     */
    omit?: FatherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FatherInclude<ExtArgs> | null
    /**
     * Filter, which Fathers to fetch.
     */
    where?: FatherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Fathers to fetch.
     */
    orderBy?: FatherOrderByWithRelationInput | FatherOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Fathers.
     */
    cursor?: FatherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Fathers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Fathers.
     */
    skip?: number
    distinct?: FatherScalarFieldEnum | FatherScalarFieldEnum[]
  }

  /**
   * Father create
   */
  export type FatherCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Father
     */
    select?: FatherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Father
     */
    omit?: FatherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FatherInclude<ExtArgs> | null
    /**
     * The data needed to create a Father.
     */
    data: XOR<FatherCreateInput, FatherUncheckedCreateInput>
  }

  /**
   * Father createMany
   */
  export type FatherCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Fathers.
     */
    data: FatherCreateManyInput | FatherCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Father createManyAndReturn
   */
  export type FatherCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Father
     */
    select?: FatherSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Father
     */
    omit?: FatherOmit<ExtArgs> | null
    /**
     * The data used to create many Fathers.
     */
    data: FatherCreateManyInput | FatherCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FatherIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Father update
   */
  export type FatherUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Father
     */
    select?: FatherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Father
     */
    omit?: FatherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FatherInclude<ExtArgs> | null
    /**
     * The data needed to update a Father.
     */
    data: XOR<FatherUpdateInput, FatherUncheckedUpdateInput>
    /**
     * Choose, which Father to update.
     */
    where: FatherWhereUniqueInput
  }

  /**
   * Father updateMany
   */
  export type FatherUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Fathers.
     */
    data: XOR<FatherUpdateManyMutationInput, FatherUncheckedUpdateManyInput>
    /**
     * Filter which Fathers to update
     */
    where?: FatherWhereInput
    /**
     * Limit how many Fathers to update.
     */
    limit?: number
  }

  /**
   * Father updateManyAndReturn
   */
  export type FatherUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Father
     */
    select?: FatherSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Father
     */
    omit?: FatherOmit<ExtArgs> | null
    /**
     * The data used to update Fathers.
     */
    data: XOR<FatherUpdateManyMutationInput, FatherUncheckedUpdateManyInput>
    /**
     * Filter which Fathers to update
     */
    where?: FatherWhereInput
    /**
     * Limit how many Fathers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FatherIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Father upsert
   */
  export type FatherUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Father
     */
    select?: FatherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Father
     */
    omit?: FatherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FatherInclude<ExtArgs> | null
    /**
     * The filter to search for the Father to update in case it exists.
     */
    where: FatherWhereUniqueInput
    /**
     * In case the Father found by the `where` argument doesn't exist, create a new Father with this data.
     */
    create: XOR<FatherCreateInput, FatherUncheckedCreateInput>
    /**
     * In case the Father was found with the provided `where` argument, update it with this data.
     */
    update: XOR<FatherUpdateInput, FatherUncheckedUpdateInput>
  }

  /**
   * Father delete
   */
  export type FatherDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Father
     */
    select?: FatherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Father
     */
    omit?: FatherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FatherInclude<ExtArgs> | null
    /**
     * Filter which Father to delete.
     */
    where: FatherWhereUniqueInput
  }

  /**
   * Father deleteMany
   */
  export type FatherDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Fathers to delete
     */
    where?: FatherWhereInput
    /**
     * Limit how many Fathers to delete.
     */
    limit?: number
  }

  /**
   * Father without action
   */
  export type FatherDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Father
     */
    select?: FatherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Father
     */
    omit?: FatherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: FatherInclude<ExtArgs> | null
  }


  /**
   * Model Mother
   */

  export type AggregateMother = {
    _count: MotherCountAggregateOutputType | null
    _avg: MotherAvgAggregateOutputType | null
    _sum: MotherSumAggregateOutputType | null
    _min: MotherMinAggregateOutputType | null
    _max: MotherMaxAggregateOutputType | null
  }

  export type MotherAvgAggregateOutputType = {
    id: number | null
    studentId: number | null
  }

  export type MotherSumAggregateOutputType = {
    id: number | null
    studentId: number | null
  }

  export type MotherMinAggregateOutputType = {
    id: number | null
    studentId: number | null
    name: string | null
    status: string | null
    occupation: string | null
    incomePerMonth: string | null
    address: string | null
    phone: string | null
    medicalHistory: string | null
  }

  export type MotherMaxAggregateOutputType = {
    id: number | null
    studentId: number | null
    name: string | null
    status: string | null
    occupation: string | null
    incomePerMonth: string | null
    address: string | null
    phone: string | null
    medicalHistory: string | null
  }

  export type MotherCountAggregateOutputType = {
    id: number
    studentId: number
    name: number
    status: number
    occupation: number
    incomePerMonth: number
    address: number
    phone: number
    medicalHistory: number
    _all: number
  }


  export type MotherAvgAggregateInputType = {
    id?: true
    studentId?: true
  }

  export type MotherSumAggregateInputType = {
    id?: true
    studentId?: true
  }

  export type MotherMinAggregateInputType = {
    id?: true
    studentId?: true
    name?: true
    status?: true
    occupation?: true
    incomePerMonth?: true
    address?: true
    phone?: true
    medicalHistory?: true
  }

  export type MotherMaxAggregateInputType = {
    id?: true
    studentId?: true
    name?: true
    status?: true
    occupation?: true
    incomePerMonth?: true
    address?: true
    phone?: true
    medicalHistory?: true
  }

  export type MotherCountAggregateInputType = {
    id?: true
    studentId?: true
    name?: true
    status?: true
    occupation?: true
    incomePerMonth?: true
    address?: true
    phone?: true
    medicalHistory?: true
    _all?: true
  }

  export type MotherAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Mother to aggregate.
     */
    where?: MotherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Mothers to fetch.
     */
    orderBy?: MotherOrderByWithRelationInput | MotherOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MotherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Mothers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Mothers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Mothers
    **/
    _count?: true | MotherCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: MotherAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: MotherSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MotherMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MotherMaxAggregateInputType
  }

  export type GetMotherAggregateType<T extends MotherAggregateArgs> = {
        [P in keyof T & keyof AggregateMother]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMother[P]>
      : GetScalarType<T[P], AggregateMother[P]>
  }




  export type MotherGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MotherWhereInput
    orderBy?: MotherOrderByWithAggregationInput | MotherOrderByWithAggregationInput[]
    by: MotherScalarFieldEnum[] | MotherScalarFieldEnum
    having?: MotherScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MotherCountAggregateInputType | true
    _avg?: MotherAvgAggregateInputType
    _sum?: MotherSumAggregateInputType
    _min?: MotherMinAggregateInputType
    _max?: MotherMaxAggregateInputType
  }

  export type MotherGroupByOutputType = {
    id: number
    studentId: number
    name: string
    status: string
    occupation: string
    incomePerMonth: string
    address: string
    phone: string
    medicalHistory: string
    _count: MotherCountAggregateOutputType | null
    _avg: MotherAvgAggregateOutputType | null
    _sum: MotherSumAggregateOutputType | null
    _min: MotherMinAggregateOutputType | null
    _max: MotherMaxAggregateOutputType | null
  }

  type GetMotherGroupByPayload<T extends MotherGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MotherGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MotherGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MotherGroupByOutputType[P]>
            : GetScalarType<T[P], MotherGroupByOutputType[P]>
        }
      >
    >


  export type MotherSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    name?: boolean
    status?: boolean
    occupation?: boolean
    incomePerMonth?: boolean
    address?: boolean
    phone?: boolean
    medicalHistory?: boolean
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mother"]>

  export type MotherSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    name?: boolean
    status?: boolean
    occupation?: boolean
    incomePerMonth?: boolean
    address?: boolean
    phone?: boolean
    medicalHistory?: boolean
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mother"]>

  export type MotherSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    name?: boolean
    status?: boolean
    occupation?: boolean
    incomePerMonth?: boolean
    address?: boolean
    phone?: boolean
    medicalHistory?: boolean
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["mother"]>

  export type MotherSelectScalar = {
    id?: boolean
    studentId?: boolean
    name?: boolean
    status?: boolean
    occupation?: boolean
    incomePerMonth?: boolean
    address?: boolean
    phone?: boolean
    medicalHistory?: boolean
  }

  export type MotherOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "studentId" | "name" | "status" | "occupation" | "incomePerMonth" | "address" | "phone" | "medicalHistory", ExtArgs["result"]["mother"]>
  export type MotherInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }
  export type MotherIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }
  export type MotherIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }

  export type $MotherPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Mother"
    objects: {
      student: Prisma.$StudentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      studentId: number
      name: string
      status: string
      occupation: string
      incomePerMonth: string
      address: string
      phone: string
      medicalHistory: string
    }, ExtArgs["result"]["mother"]>
    composites: {}
  }

  type MotherGetPayload<S extends boolean | null | undefined | MotherDefaultArgs> = $Result.GetResult<Prisma.$MotherPayload, S>

  type MotherCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MotherFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MotherCountAggregateInputType | true
    }

  export interface MotherDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Mother'], meta: { name: 'Mother' } }
    /**
     * Find zero or one Mother that matches the filter.
     * @param {MotherFindUniqueArgs} args - Arguments to find a Mother
     * @example
     * // Get one Mother
     * const mother = await prisma.mother.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MotherFindUniqueArgs>(args: SelectSubset<T, MotherFindUniqueArgs<ExtArgs>>): Prisma__MotherClient<$Result.GetResult<Prisma.$MotherPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Mother that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MotherFindUniqueOrThrowArgs} args - Arguments to find a Mother
     * @example
     * // Get one Mother
     * const mother = await prisma.mother.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MotherFindUniqueOrThrowArgs>(args: SelectSubset<T, MotherFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MotherClient<$Result.GetResult<Prisma.$MotherPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Mother that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MotherFindFirstArgs} args - Arguments to find a Mother
     * @example
     * // Get one Mother
     * const mother = await prisma.mother.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MotherFindFirstArgs>(args?: SelectSubset<T, MotherFindFirstArgs<ExtArgs>>): Prisma__MotherClient<$Result.GetResult<Prisma.$MotherPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Mother that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MotherFindFirstOrThrowArgs} args - Arguments to find a Mother
     * @example
     * // Get one Mother
     * const mother = await prisma.mother.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MotherFindFirstOrThrowArgs>(args?: SelectSubset<T, MotherFindFirstOrThrowArgs<ExtArgs>>): Prisma__MotherClient<$Result.GetResult<Prisma.$MotherPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Mothers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MotherFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Mothers
     * const mothers = await prisma.mother.findMany()
     * 
     * // Get first 10 Mothers
     * const mothers = await prisma.mother.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const motherWithIdOnly = await prisma.mother.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MotherFindManyArgs>(args?: SelectSubset<T, MotherFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MotherPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Mother.
     * @param {MotherCreateArgs} args - Arguments to create a Mother.
     * @example
     * // Create one Mother
     * const Mother = await prisma.mother.create({
     *   data: {
     *     // ... data to create a Mother
     *   }
     * })
     * 
     */
    create<T extends MotherCreateArgs>(args: SelectSubset<T, MotherCreateArgs<ExtArgs>>): Prisma__MotherClient<$Result.GetResult<Prisma.$MotherPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Mothers.
     * @param {MotherCreateManyArgs} args - Arguments to create many Mothers.
     * @example
     * // Create many Mothers
     * const mother = await prisma.mother.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MotherCreateManyArgs>(args?: SelectSubset<T, MotherCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Mothers and returns the data saved in the database.
     * @param {MotherCreateManyAndReturnArgs} args - Arguments to create many Mothers.
     * @example
     * // Create many Mothers
     * const mother = await prisma.mother.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Mothers and only return the `id`
     * const motherWithIdOnly = await prisma.mother.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MotherCreateManyAndReturnArgs>(args?: SelectSubset<T, MotherCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MotherPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Mother.
     * @param {MotherDeleteArgs} args - Arguments to delete one Mother.
     * @example
     * // Delete one Mother
     * const Mother = await prisma.mother.delete({
     *   where: {
     *     // ... filter to delete one Mother
     *   }
     * })
     * 
     */
    delete<T extends MotherDeleteArgs>(args: SelectSubset<T, MotherDeleteArgs<ExtArgs>>): Prisma__MotherClient<$Result.GetResult<Prisma.$MotherPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Mother.
     * @param {MotherUpdateArgs} args - Arguments to update one Mother.
     * @example
     * // Update one Mother
     * const mother = await prisma.mother.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MotherUpdateArgs>(args: SelectSubset<T, MotherUpdateArgs<ExtArgs>>): Prisma__MotherClient<$Result.GetResult<Prisma.$MotherPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Mothers.
     * @param {MotherDeleteManyArgs} args - Arguments to filter Mothers to delete.
     * @example
     * // Delete a few Mothers
     * const { count } = await prisma.mother.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MotherDeleteManyArgs>(args?: SelectSubset<T, MotherDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Mothers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MotherUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Mothers
     * const mother = await prisma.mother.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MotherUpdateManyArgs>(args: SelectSubset<T, MotherUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Mothers and returns the data updated in the database.
     * @param {MotherUpdateManyAndReturnArgs} args - Arguments to update many Mothers.
     * @example
     * // Update many Mothers
     * const mother = await prisma.mother.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Mothers and only return the `id`
     * const motherWithIdOnly = await prisma.mother.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MotherUpdateManyAndReturnArgs>(args: SelectSubset<T, MotherUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MotherPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Mother.
     * @param {MotherUpsertArgs} args - Arguments to update or create a Mother.
     * @example
     * // Update or create a Mother
     * const mother = await prisma.mother.upsert({
     *   create: {
     *     // ... data to create a Mother
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Mother we want to update
     *   }
     * })
     */
    upsert<T extends MotherUpsertArgs>(args: SelectSubset<T, MotherUpsertArgs<ExtArgs>>): Prisma__MotherClient<$Result.GetResult<Prisma.$MotherPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Mothers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MotherCountArgs} args - Arguments to filter Mothers to count.
     * @example
     * // Count the number of Mothers
     * const count = await prisma.mother.count({
     *   where: {
     *     // ... the filter for the Mothers we want to count
     *   }
     * })
    **/
    count<T extends MotherCountArgs>(
      args?: Subset<T, MotherCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MotherCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Mother.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MotherAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MotherAggregateArgs>(args: Subset<T, MotherAggregateArgs>): Prisma.PrismaPromise<GetMotherAggregateType<T>>

    /**
     * Group by Mother.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MotherGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MotherGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MotherGroupByArgs['orderBy'] }
        : { orderBy?: MotherGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MotherGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMotherGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Mother model
   */
  readonly fields: MotherFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Mother.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MotherClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    student<T extends StudentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StudentDefaultArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Mother model
   */
  interface MotherFieldRefs {
    readonly id: FieldRef<"Mother", 'Int'>
    readonly studentId: FieldRef<"Mother", 'Int'>
    readonly name: FieldRef<"Mother", 'String'>
    readonly status: FieldRef<"Mother", 'String'>
    readonly occupation: FieldRef<"Mother", 'String'>
    readonly incomePerMonth: FieldRef<"Mother", 'String'>
    readonly address: FieldRef<"Mother", 'String'>
    readonly phone: FieldRef<"Mother", 'String'>
    readonly medicalHistory: FieldRef<"Mother", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Mother findUnique
   */
  export type MotherFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mother
     */
    select?: MotherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mother
     */
    omit?: MotherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherInclude<ExtArgs> | null
    /**
     * Filter, which Mother to fetch.
     */
    where: MotherWhereUniqueInput
  }

  /**
   * Mother findUniqueOrThrow
   */
  export type MotherFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mother
     */
    select?: MotherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mother
     */
    omit?: MotherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherInclude<ExtArgs> | null
    /**
     * Filter, which Mother to fetch.
     */
    where: MotherWhereUniqueInput
  }

  /**
   * Mother findFirst
   */
  export type MotherFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mother
     */
    select?: MotherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mother
     */
    omit?: MotherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherInclude<ExtArgs> | null
    /**
     * Filter, which Mother to fetch.
     */
    where?: MotherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Mothers to fetch.
     */
    orderBy?: MotherOrderByWithRelationInput | MotherOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Mothers.
     */
    cursor?: MotherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Mothers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Mothers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Mothers.
     */
    distinct?: MotherScalarFieldEnum | MotherScalarFieldEnum[]
  }

  /**
   * Mother findFirstOrThrow
   */
  export type MotherFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mother
     */
    select?: MotherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mother
     */
    omit?: MotherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherInclude<ExtArgs> | null
    /**
     * Filter, which Mother to fetch.
     */
    where?: MotherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Mothers to fetch.
     */
    orderBy?: MotherOrderByWithRelationInput | MotherOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Mothers.
     */
    cursor?: MotherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Mothers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Mothers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Mothers.
     */
    distinct?: MotherScalarFieldEnum | MotherScalarFieldEnum[]
  }

  /**
   * Mother findMany
   */
  export type MotherFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mother
     */
    select?: MotherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mother
     */
    omit?: MotherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherInclude<ExtArgs> | null
    /**
     * Filter, which Mothers to fetch.
     */
    where?: MotherWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Mothers to fetch.
     */
    orderBy?: MotherOrderByWithRelationInput | MotherOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Mothers.
     */
    cursor?: MotherWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Mothers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Mothers.
     */
    skip?: number
    distinct?: MotherScalarFieldEnum | MotherScalarFieldEnum[]
  }

  /**
   * Mother create
   */
  export type MotherCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mother
     */
    select?: MotherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mother
     */
    omit?: MotherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherInclude<ExtArgs> | null
    /**
     * The data needed to create a Mother.
     */
    data: XOR<MotherCreateInput, MotherUncheckedCreateInput>
  }

  /**
   * Mother createMany
   */
  export type MotherCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Mothers.
     */
    data: MotherCreateManyInput | MotherCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Mother createManyAndReturn
   */
  export type MotherCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mother
     */
    select?: MotherSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Mother
     */
    omit?: MotherOmit<ExtArgs> | null
    /**
     * The data used to create many Mothers.
     */
    data: MotherCreateManyInput | MotherCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Mother update
   */
  export type MotherUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mother
     */
    select?: MotherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mother
     */
    omit?: MotherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherInclude<ExtArgs> | null
    /**
     * The data needed to update a Mother.
     */
    data: XOR<MotherUpdateInput, MotherUncheckedUpdateInput>
    /**
     * Choose, which Mother to update.
     */
    where: MotherWhereUniqueInput
  }

  /**
   * Mother updateMany
   */
  export type MotherUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Mothers.
     */
    data: XOR<MotherUpdateManyMutationInput, MotherUncheckedUpdateManyInput>
    /**
     * Filter which Mothers to update
     */
    where?: MotherWhereInput
    /**
     * Limit how many Mothers to update.
     */
    limit?: number
  }

  /**
   * Mother updateManyAndReturn
   */
  export type MotherUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mother
     */
    select?: MotherSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Mother
     */
    omit?: MotherOmit<ExtArgs> | null
    /**
     * The data used to update Mothers.
     */
    data: XOR<MotherUpdateManyMutationInput, MotherUncheckedUpdateManyInput>
    /**
     * Filter which Mothers to update
     */
    where?: MotherWhereInput
    /**
     * Limit how many Mothers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Mother upsert
   */
  export type MotherUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mother
     */
    select?: MotherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mother
     */
    omit?: MotherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherInclude<ExtArgs> | null
    /**
     * The filter to search for the Mother to update in case it exists.
     */
    where: MotherWhereUniqueInput
    /**
     * In case the Mother found by the `where` argument doesn't exist, create a new Mother with this data.
     */
    create: XOR<MotherCreateInput, MotherUncheckedCreateInput>
    /**
     * In case the Mother was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MotherUpdateInput, MotherUncheckedUpdateInput>
  }

  /**
   * Mother delete
   */
  export type MotherDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mother
     */
    select?: MotherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mother
     */
    omit?: MotherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherInclude<ExtArgs> | null
    /**
     * Filter which Mother to delete.
     */
    where: MotherWhereUniqueInput
  }

  /**
   * Mother deleteMany
   */
  export type MotherDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Mothers to delete
     */
    where?: MotherWhereInput
    /**
     * Limit how many Mothers to delete.
     */
    limit?: number
  }

  /**
   * Mother without action
   */
  export type MotherDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Mother
     */
    select?: MotherSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Mother
     */
    omit?: MotherOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MotherInclude<ExtArgs> | null
  }


  /**
   * Model Guardian
   */

  export type AggregateGuardian = {
    _count: GuardianCountAggregateOutputType | null
    _avg: GuardianAvgAggregateOutputType | null
    _sum: GuardianSumAggregateOutputType | null
    _min: GuardianMinAggregateOutputType | null
    _max: GuardianMaxAggregateOutputType | null
  }

  export type GuardianAvgAggregateOutputType = {
    id: number | null
    studentId: number | null
  }

  export type GuardianSumAggregateOutputType = {
    id: number | null
    studentId: number | null
  }

  export type GuardianMinAggregateOutputType = {
    id: number | null
    studentId: number | null
    name: string | null
    status: string | null
    occupation: string | null
    incomePerMonth: string | null
    address: string | null
    phone: string | null
    medicalHistory: string | null
  }

  export type GuardianMaxAggregateOutputType = {
    id: number | null
    studentId: number | null
    name: string | null
    status: string | null
    occupation: string | null
    incomePerMonth: string | null
    address: string | null
    phone: string | null
    medicalHistory: string | null
  }

  export type GuardianCountAggregateOutputType = {
    id: number
    studentId: number
    name: number
    status: number
    occupation: number
    incomePerMonth: number
    address: number
    phone: number
    medicalHistory: number
    _all: number
  }


  export type GuardianAvgAggregateInputType = {
    id?: true
    studentId?: true
  }

  export type GuardianSumAggregateInputType = {
    id?: true
    studentId?: true
  }

  export type GuardianMinAggregateInputType = {
    id?: true
    studentId?: true
    name?: true
    status?: true
    occupation?: true
    incomePerMonth?: true
    address?: true
    phone?: true
    medicalHistory?: true
  }

  export type GuardianMaxAggregateInputType = {
    id?: true
    studentId?: true
    name?: true
    status?: true
    occupation?: true
    incomePerMonth?: true
    address?: true
    phone?: true
    medicalHistory?: true
  }

  export type GuardianCountAggregateInputType = {
    id?: true
    studentId?: true
    name?: true
    status?: true
    occupation?: true
    incomePerMonth?: true
    address?: true
    phone?: true
    medicalHistory?: true
    _all?: true
  }

  export type GuardianAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Guardian to aggregate.
     */
    where?: GuardianWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Guardians to fetch.
     */
    orderBy?: GuardianOrderByWithRelationInput | GuardianOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GuardianWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Guardians from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Guardians.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Guardians
    **/
    _count?: true | GuardianCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GuardianAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GuardianSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GuardianMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GuardianMaxAggregateInputType
  }

  export type GetGuardianAggregateType<T extends GuardianAggregateArgs> = {
        [P in keyof T & keyof AggregateGuardian]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGuardian[P]>
      : GetScalarType<T[P], AggregateGuardian[P]>
  }




  export type GuardianGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GuardianWhereInput
    orderBy?: GuardianOrderByWithAggregationInput | GuardianOrderByWithAggregationInput[]
    by: GuardianScalarFieldEnum[] | GuardianScalarFieldEnum
    having?: GuardianScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GuardianCountAggregateInputType | true
    _avg?: GuardianAvgAggregateInputType
    _sum?: GuardianSumAggregateInputType
    _min?: GuardianMinAggregateInputType
    _max?: GuardianMaxAggregateInputType
  }

  export type GuardianGroupByOutputType = {
    id: number
    studentId: number
    name: string
    status: string
    occupation: string
    incomePerMonth: string
    address: string
    phone: string
    medicalHistory: string
    _count: GuardianCountAggregateOutputType | null
    _avg: GuardianAvgAggregateOutputType | null
    _sum: GuardianSumAggregateOutputType | null
    _min: GuardianMinAggregateOutputType | null
    _max: GuardianMaxAggregateOutputType | null
  }

  type GetGuardianGroupByPayload<T extends GuardianGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GuardianGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GuardianGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GuardianGroupByOutputType[P]>
            : GetScalarType<T[P], GuardianGroupByOutputType[P]>
        }
      >
    >


  export type GuardianSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    name?: boolean
    status?: boolean
    occupation?: boolean
    incomePerMonth?: boolean
    address?: boolean
    phone?: boolean
    medicalHistory?: boolean
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guardian"]>

  export type GuardianSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    name?: boolean
    status?: boolean
    occupation?: boolean
    incomePerMonth?: boolean
    address?: boolean
    phone?: boolean
    medicalHistory?: boolean
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guardian"]>

  export type GuardianSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    name?: boolean
    status?: boolean
    occupation?: boolean
    incomePerMonth?: boolean
    address?: boolean
    phone?: boolean
    medicalHistory?: boolean
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["guardian"]>

  export type GuardianSelectScalar = {
    id?: boolean
    studentId?: boolean
    name?: boolean
    status?: boolean
    occupation?: boolean
    incomePerMonth?: boolean
    address?: boolean
    phone?: boolean
    medicalHistory?: boolean
  }

  export type GuardianOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "studentId" | "name" | "status" | "occupation" | "incomePerMonth" | "address" | "phone" | "medicalHistory", ExtArgs["result"]["guardian"]>
  export type GuardianInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }
  export type GuardianIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }
  export type GuardianIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }

  export type $GuardianPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Guardian"
    objects: {
      student: Prisma.$StudentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      studentId: number
      name: string
      status: string
      occupation: string
      incomePerMonth: string
      address: string
      phone: string
      medicalHistory: string
    }, ExtArgs["result"]["guardian"]>
    composites: {}
  }

  type GuardianGetPayload<S extends boolean | null | undefined | GuardianDefaultArgs> = $Result.GetResult<Prisma.$GuardianPayload, S>

  type GuardianCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GuardianFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GuardianCountAggregateInputType | true
    }

  export interface GuardianDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Guardian'], meta: { name: 'Guardian' } }
    /**
     * Find zero or one Guardian that matches the filter.
     * @param {GuardianFindUniqueArgs} args - Arguments to find a Guardian
     * @example
     * // Get one Guardian
     * const guardian = await prisma.guardian.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GuardianFindUniqueArgs>(args: SelectSubset<T, GuardianFindUniqueArgs<ExtArgs>>): Prisma__GuardianClient<$Result.GetResult<Prisma.$GuardianPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Guardian that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GuardianFindUniqueOrThrowArgs} args - Arguments to find a Guardian
     * @example
     * // Get one Guardian
     * const guardian = await prisma.guardian.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GuardianFindUniqueOrThrowArgs>(args: SelectSubset<T, GuardianFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GuardianClient<$Result.GetResult<Prisma.$GuardianPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Guardian that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuardianFindFirstArgs} args - Arguments to find a Guardian
     * @example
     * // Get one Guardian
     * const guardian = await prisma.guardian.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GuardianFindFirstArgs>(args?: SelectSubset<T, GuardianFindFirstArgs<ExtArgs>>): Prisma__GuardianClient<$Result.GetResult<Prisma.$GuardianPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Guardian that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuardianFindFirstOrThrowArgs} args - Arguments to find a Guardian
     * @example
     * // Get one Guardian
     * const guardian = await prisma.guardian.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GuardianFindFirstOrThrowArgs>(args?: SelectSubset<T, GuardianFindFirstOrThrowArgs<ExtArgs>>): Prisma__GuardianClient<$Result.GetResult<Prisma.$GuardianPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Guardians that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuardianFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Guardians
     * const guardians = await prisma.guardian.findMany()
     * 
     * // Get first 10 Guardians
     * const guardians = await prisma.guardian.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const guardianWithIdOnly = await prisma.guardian.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GuardianFindManyArgs>(args?: SelectSubset<T, GuardianFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuardianPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Guardian.
     * @param {GuardianCreateArgs} args - Arguments to create a Guardian.
     * @example
     * // Create one Guardian
     * const Guardian = await prisma.guardian.create({
     *   data: {
     *     // ... data to create a Guardian
     *   }
     * })
     * 
     */
    create<T extends GuardianCreateArgs>(args: SelectSubset<T, GuardianCreateArgs<ExtArgs>>): Prisma__GuardianClient<$Result.GetResult<Prisma.$GuardianPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Guardians.
     * @param {GuardianCreateManyArgs} args - Arguments to create many Guardians.
     * @example
     * // Create many Guardians
     * const guardian = await prisma.guardian.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GuardianCreateManyArgs>(args?: SelectSubset<T, GuardianCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Guardians and returns the data saved in the database.
     * @param {GuardianCreateManyAndReturnArgs} args - Arguments to create many Guardians.
     * @example
     * // Create many Guardians
     * const guardian = await prisma.guardian.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Guardians and only return the `id`
     * const guardianWithIdOnly = await prisma.guardian.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GuardianCreateManyAndReturnArgs>(args?: SelectSubset<T, GuardianCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuardianPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Guardian.
     * @param {GuardianDeleteArgs} args - Arguments to delete one Guardian.
     * @example
     * // Delete one Guardian
     * const Guardian = await prisma.guardian.delete({
     *   where: {
     *     // ... filter to delete one Guardian
     *   }
     * })
     * 
     */
    delete<T extends GuardianDeleteArgs>(args: SelectSubset<T, GuardianDeleteArgs<ExtArgs>>): Prisma__GuardianClient<$Result.GetResult<Prisma.$GuardianPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Guardian.
     * @param {GuardianUpdateArgs} args - Arguments to update one Guardian.
     * @example
     * // Update one Guardian
     * const guardian = await prisma.guardian.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GuardianUpdateArgs>(args: SelectSubset<T, GuardianUpdateArgs<ExtArgs>>): Prisma__GuardianClient<$Result.GetResult<Prisma.$GuardianPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Guardians.
     * @param {GuardianDeleteManyArgs} args - Arguments to filter Guardians to delete.
     * @example
     * // Delete a few Guardians
     * const { count } = await prisma.guardian.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GuardianDeleteManyArgs>(args?: SelectSubset<T, GuardianDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Guardians.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuardianUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Guardians
     * const guardian = await prisma.guardian.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GuardianUpdateManyArgs>(args: SelectSubset<T, GuardianUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Guardians and returns the data updated in the database.
     * @param {GuardianUpdateManyAndReturnArgs} args - Arguments to update many Guardians.
     * @example
     * // Update many Guardians
     * const guardian = await prisma.guardian.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Guardians and only return the `id`
     * const guardianWithIdOnly = await prisma.guardian.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GuardianUpdateManyAndReturnArgs>(args: SelectSubset<T, GuardianUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GuardianPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Guardian.
     * @param {GuardianUpsertArgs} args - Arguments to update or create a Guardian.
     * @example
     * // Update or create a Guardian
     * const guardian = await prisma.guardian.upsert({
     *   create: {
     *     // ... data to create a Guardian
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Guardian we want to update
     *   }
     * })
     */
    upsert<T extends GuardianUpsertArgs>(args: SelectSubset<T, GuardianUpsertArgs<ExtArgs>>): Prisma__GuardianClient<$Result.GetResult<Prisma.$GuardianPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Guardians.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuardianCountArgs} args - Arguments to filter Guardians to count.
     * @example
     * // Count the number of Guardians
     * const count = await prisma.guardian.count({
     *   where: {
     *     // ... the filter for the Guardians we want to count
     *   }
     * })
    **/
    count<T extends GuardianCountArgs>(
      args?: Subset<T, GuardianCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GuardianCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Guardian.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuardianAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GuardianAggregateArgs>(args: Subset<T, GuardianAggregateArgs>): Prisma.PrismaPromise<GetGuardianAggregateType<T>>

    /**
     * Group by Guardian.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GuardianGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GuardianGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GuardianGroupByArgs['orderBy'] }
        : { orderBy?: GuardianGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GuardianGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGuardianGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Guardian model
   */
  readonly fields: GuardianFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Guardian.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GuardianClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    student<T extends StudentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StudentDefaultArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Guardian model
   */
  interface GuardianFieldRefs {
    readonly id: FieldRef<"Guardian", 'Int'>
    readonly studentId: FieldRef<"Guardian", 'Int'>
    readonly name: FieldRef<"Guardian", 'String'>
    readonly status: FieldRef<"Guardian", 'String'>
    readonly occupation: FieldRef<"Guardian", 'String'>
    readonly incomePerMonth: FieldRef<"Guardian", 'String'>
    readonly address: FieldRef<"Guardian", 'String'>
    readonly phone: FieldRef<"Guardian", 'String'>
    readonly medicalHistory: FieldRef<"Guardian", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Guardian findUnique
   */
  export type GuardianFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guardian
     */
    select?: GuardianSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guardian
     */
    omit?: GuardianOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuardianInclude<ExtArgs> | null
    /**
     * Filter, which Guardian to fetch.
     */
    where: GuardianWhereUniqueInput
  }

  /**
   * Guardian findUniqueOrThrow
   */
  export type GuardianFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guardian
     */
    select?: GuardianSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guardian
     */
    omit?: GuardianOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuardianInclude<ExtArgs> | null
    /**
     * Filter, which Guardian to fetch.
     */
    where: GuardianWhereUniqueInput
  }

  /**
   * Guardian findFirst
   */
  export type GuardianFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guardian
     */
    select?: GuardianSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guardian
     */
    omit?: GuardianOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuardianInclude<ExtArgs> | null
    /**
     * Filter, which Guardian to fetch.
     */
    where?: GuardianWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Guardians to fetch.
     */
    orderBy?: GuardianOrderByWithRelationInput | GuardianOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Guardians.
     */
    cursor?: GuardianWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Guardians from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Guardians.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Guardians.
     */
    distinct?: GuardianScalarFieldEnum | GuardianScalarFieldEnum[]
  }

  /**
   * Guardian findFirstOrThrow
   */
  export type GuardianFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guardian
     */
    select?: GuardianSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guardian
     */
    omit?: GuardianOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuardianInclude<ExtArgs> | null
    /**
     * Filter, which Guardian to fetch.
     */
    where?: GuardianWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Guardians to fetch.
     */
    orderBy?: GuardianOrderByWithRelationInput | GuardianOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Guardians.
     */
    cursor?: GuardianWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Guardians from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Guardians.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Guardians.
     */
    distinct?: GuardianScalarFieldEnum | GuardianScalarFieldEnum[]
  }

  /**
   * Guardian findMany
   */
  export type GuardianFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guardian
     */
    select?: GuardianSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guardian
     */
    omit?: GuardianOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuardianInclude<ExtArgs> | null
    /**
     * Filter, which Guardians to fetch.
     */
    where?: GuardianWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Guardians to fetch.
     */
    orderBy?: GuardianOrderByWithRelationInput | GuardianOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Guardians.
     */
    cursor?: GuardianWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Guardians from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Guardians.
     */
    skip?: number
    distinct?: GuardianScalarFieldEnum | GuardianScalarFieldEnum[]
  }

  /**
   * Guardian create
   */
  export type GuardianCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guardian
     */
    select?: GuardianSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guardian
     */
    omit?: GuardianOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuardianInclude<ExtArgs> | null
    /**
     * The data needed to create a Guardian.
     */
    data: XOR<GuardianCreateInput, GuardianUncheckedCreateInput>
  }

  /**
   * Guardian createMany
   */
  export type GuardianCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Guardians.
     */
    data: GuardianCreateManyInput | GuardianCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Guardian createManyAndReturn
   */
  export type GuardianCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guardian
     */
    select?: GuardianSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Guardian
     */
    omit?: GuardianOmit<ExtArgs> | null
    /**
     * The data used to create many Guardians.
     */
    data: GuardianCreateManyInput | GuardianCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuardianIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Guardian update
   */
  export type GuardianUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guardian
     */
    select?: GuardianSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guardian
     */
    omit?: GuardianOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuardianInclude<ExtArgs> | null
    /**
     * The data needed to update a Guardian.
     */
    data: XOR<GuardianUpdateInput, GuardianUncheckedUpdateInput>
    /**
     * Choose, which Guardian to update.
     */
    where: GuardianWhereUniqueInput
  }

  /**
   * Guardian updateMany
   */
  export type GuardianUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Guardians.
     */
    data: XOR<GuardianUpdateManyMutationInput, GuardianUncheckedUpdateManyInput>
    /**
     * Filter which Guardians to update
     */
    where?: GuardianWhereInput
    /**
     * Limit how many Guardians to update.
     */
    limit?: number
  }

  /**
   * Guardian updateManyAndReturn
   */
  export type GuardianUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guardian
     */
    select?: GuardianSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Guardian
     */
    omit?: GuardianOmit<ExtArgs> | null
    /**
     * The data used to update Guardians.
     */
    data: XOR<GuardianUpdateManyMutationInput, GuardianUncheckedUpdateManyInput>
    /**
     * Filter which Guardians to update
     */
    where?: GuardianWhereInput
    /**
     * Limit how many Guardians to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuardianIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Guardian upsert
   */
  export type GuardianUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guardian
     */
    select?: GuardianSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guardian
     */
    omit?: GuardianOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuardianInclude<ExtArgs> | null
    /**
     * The filter to search for the Guardian to update in case it exists.
     */
    where: GuardianWhereUniqueInput
    /**
     * In case the Guardian found by the `where` argument doesn't exist, create a new Guardian with this data.
     */
    create: XOR<GuardianCreateInput, GuardianUncheckedCreateInput>
    /**
     * In case the Guardian was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GuardianUpdateInput, GuardianUncheckedUpdateInput>
  }

  /**
   * Guardian delete
   */
  export type GuardianDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guardian
     */
    select?: GuardianSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guardian
     */
    omit?: GuardianOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuardianInclude<ExtArgs> | null
    /**
     * Filter which Guardian to delete.
     */
    where: GuardianWhereUniqueInput
  }

  /**
   * Guardian deleteMany
   */
  export type GuardianDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Guardians to delete
     */
    where?: GuardianWhereInput
    /**
     * Limit how many Guardians to delete.
     */
    limit?: number
  }

  /**
   * Guardian without action
   */
  export type GuardianDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Guardian
     */
    select?: GuardianSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Guardian
     */
    omit?: GuardianOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GuardianInclude<ExtArgs> | null
  }


  /**
   * Model Document
   */

  export type AggregateDocument = {
    _count: DocumentCountAggregateOutputType | null
    _avg: DocumentAvgAggregateOutputType | null
    _sum: DocumentSumAggregateOutputType | null
    _min: DocumentMinAggregateOutputType | null
    _max: DocumentMaxAggregateOutputType | null
  }

  export type DocumentAvgAggregateOutputType = {
    id: number | null
    studentId: number | null
  }

  export type DocumentSumAggregateOutputType = {
    id: number | null
    studentId: number | null
  }

  export type DocumentMinAggregateOutputType = {
    id: number | null
    studentId: number | null
    type: string | null
    fileUrl: string | null
    uploadedAt: Date | null
  }

  export type DocumentMaxAggregateOutputType = {
    id: number | null
    studentId: number | null
    type: string | null
    fileUrl: string | null
    uploadedAt: Date | null
  }

  export type DocumentCountAggregateOutputType = {
    id: number
    studentId: number
    type: number
    fileUrl: number
    uploadedAt: number
    _all: number
  }


  export type DocumentAvgAggregateInputType = {
    id?: true
    studentId?: true
  }

  export type DocumentSumAggregateInputType = {
    id?: true
    studentId?: true
  }

  export type DocumentMinAggregateInputType = {
    id?: true
    studentId?: true
    type?: true
    fileUrl?: true
    uploadedAt?: true
  }

  export type DocumentMaxAggregateInputType = {
    id?: true
    studentId?: true
    type?: true
    fileUrl?: true
    uploadedAt?: true
  }

  export type DocumentCountAggregateInputType = {
    id?: true
    studentId?: true
    type?: true
    fileUrl?: true
    uploadedAt?: true
    _all?: true
  }

  export type DocumentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Document to aggregate.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Documents
    **/
    _count?: true | DocumentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DocumentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DocumentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DocumentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DocumentMaxAggregateInputType
  }

  export type GetDocumentAggregateType<T extends DocumentAggregateArgs> = {
        [P in keyof T & keyof AggregateDocument]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDocument[P]>
      : GetScalarType<T[P], AggregateDocument[P]>
  }




  export type DocumentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentWhereInput
    orderBy?: DocumentOrderByWithAggregationInput | DocumentOrderByWithAggregationInput[]
    by: DocumentScalarFieldEnum[] | DocumentScalarFieldEnum
    having?: DocumentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DocumentCountAggregateInputType | true
    _avg?: DocumentAvgAggregateInputType
    _sum?: DocumentSumAggregateInputType
    _min?: DocumentMinAggregateInputType
    _max?: DocumentMaxAggregateInputType
  }

  export type DocumentGroupByOutputType = {
    id: number
    studentId: number
    type: string
    fileUrl: string
    uploadedAt: Date
    _count: DocumentCountAggregateOutputType | null
    _avg: DocumentAvgAggregateOutputType | null
    _sum: DocumentSumAggregateOutputType | null
    _min: DocumentMinAggregateOutputType | null
    _max: DocumentMaxAggregateOutputType | null
  }

  type GetDocumentGroupByPayload<T extends DocumentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DocumentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DocumentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DocumentGroupByOutputType[P]>
            : GetScalarType<T[P], DocumentGroupByOutputType[P]>
        }
      >
    >


  export type DocumentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    type?: boolean
    fileUrl?: boolean
    uploadedAt?: boolean
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    type?: boolean
    fileUrl?: boolean
    uploadedAt?: boolean
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    type?: boolean
    fileUrl?: boolean
    uploadedAt?: boolean
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectScalar = {
    id?: boolean
    studentId?: boolean
    type?: boolean
    fileUrl?: boolean
    uploadedAt?: boolean
  }

  export type DocumentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "studentId" | "type" | "fileUrl" | "uploadedAt", ExtArgs["result"]["document"]>
  export type DocumentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }
  export type DocumentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }
  export type DocumentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    student?: boolean | StudentDefaultArgs<ExtArgs>
  }

  export type $DocumentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Document"
    objects: {
      student: Prisma.$StudentPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      studentId: number
      type: string
      fileUrl: string
      uploadedAt: Date
    }, ExtArgs["result"]["document"]>
    composites: {}
  }

  type DocumentGetPayload<S extends boolean | null | undefined | DocumentDefaultArgs> = $Result.GetResult<Prisma.$DocumentPayload, S>

  type DocumentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DocumentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DocumentCountAggregateInputType | true
    }

  export interface DocumentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Document'], meta: { name: 'Document' } }
    /**
     * Find zero or one Document that matches the filter.
     * @param {DocumentFindUniqueArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DocumentFindUniqueArgs>(args: SelectSubset<T, DocumentFindUniqueArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Document that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DocumentFindUniqueOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DocumentFindUniqueOrThrowArgs>(args: SelectSubset<T, DocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Document that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DocumentFindFirstArgs>(args?: SelectSubset<T, DocumentFindFirstArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Document that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DocumentFindFirstOrThrowArgs>(args?: SelectSubset<T, DocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Documents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Documents
     * const documents = await prisma.document.findMany()
     * 
     * // Get first 10 Documents
     * const documents = await prisma.document.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const documentWithIdOnly = await prisma.document.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DocumentFindManyArgs>(args?: SelectSubset<T, DocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Document.
     * @param {DocumentCreateArgs} args - Arguments to create a Document.
     * @example
     * // Create one Document
     * const Document = await prisma.document.create({
     *   data: {
     *     // ... data to create a Document
     *   }
     * })
     * 
     */
    create<T extends DocumentCreateArgs>(args: SelectSubset<T, DocumentCreateArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Documents.
     * @param {DocumentCreateManyArgs} args - Arguments to create many Documents.
     * @example
     * // Create many Documents
     * const document = await prisma.document.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DocumentCreateManyArgs>(args?: SelectSubset<T, DocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Documents and returns the data saved in the database.
     * @param {DocumentCreateManyAndReturnArgs} args - Arguments to create many Documents.
     * @example
     * // Create many Documents
     * const document = await prisma.document.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Documents and only return the `id`
     * const documentWithIdOnly = await prisma.document.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DocumentCreateManyAndReturnArgs>(args?: SelectSubset<T, DocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Document.
     * @param {DocumentDeleteArgs} args - Arguments to delete one Document.
     * @example
     * // Delete one Document
     * const Document = await prisma.document.delete({
     *   where: {
     *     // ... filter to delete one Document
     *   }
     * })
     * 
     */
    delete<T extends DocumentDeleteArgs>(args: SelectSubset<T, DocumentDeleteArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Document.
     * @param {DocumentUpdateArgs} args - Arguments to update one Document.
     * @example
     * // Update one Document
     * const document = await prisma.document.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DocumentUpdateArgs>(args: SelectSubset<T, DocumentUpdateArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Documents.
     * @param {DocumentDeleteManyArgs} args - Arguments to filter Documents to delete.
     * @example
     * // Delete a few Documents
     * const { count } = await prisma.document.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DocumentDeleteManyArgs>(args?: SelectSubset<T, DocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Documents
     * const document = await prisma.document.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DocumentUpdateManyArgs>(args: SelectSubset<T, DocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Documents and returns the data updated in the database.
     * @param {DocumentUpdateManyAndReturnArgs} args - Arguments to update many Documents.
     * @example
     * // Update many Documents
     * const document = await prisma.document.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Documents and only return the `id`
     * const documentWithIdOnly = await prisma.document.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DocumentUpdateManyAndReturnArgs>(args: SelectSubset<T, DocumentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Document.
     * @param {DocumentUpsertArgs} args - Arguments to update or create a Document.
     * @example
     * // Update or create a Document
     * const document = await prisma.document.upsert({
     *   create: {
     *     // ... data to create a Document
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Document we want to update
     *   }
     * })
     */
    upsert<T extends DocumentUpsertArgs>(args: SelectSubset<T, DocumentUpsertArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentCountArgs} args - Arguments to filter Documents to count.
     * @example
     * // Count the number of Documents
     * const count = await prisma.document.count({
     *   where: {
     *     // ... the filter for the Documents we want to count
     *   }
     * })
    **/
    count<T extends DocumentCountArgs>(
      args?: Subset<T, DocumentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DocumentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DocumentAggregateArgs>(args: Subset<T, DocumentAggregateArgs>): Prisma.PrismaPromise<GetDocumentAggregateType<T>>

    /**
     * Group by Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DocumentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DocumentGroupByArgs['orderBy'] }
        : { orderBy?: DocumentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Document model
   */
  readonly fields: DocumentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Document.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DocumentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    student<T extends StudentDefaultArgs<ExtArgs> = {}>(args?: Subset<T, StudentDefaultArgs<ExtArgs>>): Prisma__StudentClient<$Result.GetResult<Prisma.$StudentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Document model
   */
  interface DocumentFieldRefs {
    readonly id: FieldRef<"Document", 'Int'>
    readonly studentId: FieldRef<"Document", 'Int'>
    readonly type: FieldRef<"Document", 'String'>
    readonly fileUrl: FieldRef<"Document", 'String'>
    readonly uploadedAt: FieldRef<"Document", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Document findUnique
   */
  export type DocumentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document findUniqueOrThrow
   */
  export type DocumentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document findFirst
   */
  export type DocumentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Documents.
     */
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document findFirstOrThrow
   */
  export type DocumentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Documents.
     */
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document findMany
   */
  export type DocumentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Documents to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document create
   */
  export type DocumentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The data needed to create a Document.
     */
    data: XOR<DocumentCreateInput, DocumentUncheckedCreateInput>
  }

  /**
   * Document createMany
   */
  export type DocumentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Documents.
     */
    data: DocumentCreateManyInput | DocumentCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Document createManyAndReturn
   */
  export type DocumentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * The data used to create many Documents.
     */
    data: DocumentCreateManyInput | DocumentCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Document update
   */
  export type DocumentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The data needed to update a Document.
     */
    data: XOR<DocumentUpdateInput, DocumentUncheckedUpdateInput>
    /**
     * Choose, which Document to update.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document updateMany
   */
  export type DocumentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Documents.
     */
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyInput>
    /**
     * Filter which Documents to update
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to update.
     */
    limit?: number
  }

  /**
   * Document updateManyAndReturn
   */
  export type DocumentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * The data used to update Documents.
     */
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyInput>
    /**
     * Filter which Documents to update
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Document upsert
   */
  export type DocumentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The filter to search for the Document to update in case it exists.
     */
    where: DocumentWhereUniqueInput
    /**
     * In case the Document found by the `where` argument doesn't exist, create a new Document with this data.
     */
    create: XOR<DocumentCreateInput, DocumentUncheckedCreateInput>
    /**
     * In case the Document was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DocumentUpdateInput, DocumentUncheckedUpdateInput>
  }

  /**
   * Document delete
   */
  export type DocumentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter which Document to delete.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document deleteMany
   */
  export type DocumentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Documents to delete
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to delete.
     */
    limit?: number
  }

  /**
   * Document without action
   */
  export type DocumentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const PengawasScalarFieldEnum: {
    id: 'id',
    username: 'username',
    password: 'password',
    name: 'name',
    wilayah: 'wilayah'
  };

  export type PengawasScalarFieldEnum = (typeof PengawasScalarFieldEnum)[keyof typeof PengawasScalarFieldEnum]


  export const StudentScalarFieldEnum: {
    id: 'id',
    username: 'username',
    nik: 'nik',
    fullName: 'fullName',
    dateOfBirth: 'dateOfBirth',
    gender: 'gender',
    citaCita: 'citaCita',
    wilayah: 'wilayah',
    pengawasId: 'pengawasId',
    alamatLengkap: 'alamatLengkap',
    noHp: 'noHp',
    riwayatPenyakit: 'riwayatPenyakit',
    schoolName: 'schoolName',
    gradeLevel: 'gradeLevel',
    nilaiRataRata: 'nilaiRataRata',
    jumlahSaudara: 'jumlahSaudara',
    createdAt: 'createdAt'
  };

  export type StudentScalarFieldEnum = (typeof StudentScalarFieldEnum)[keyof typeof StudentScalarFieldEnum]


  export const EducationCostScalarFieldEnum: {
    id: 'id',
    studentId: 'studentId',
    label: 'label',
    amount: 'amount'
  };

  export type EducationCostScalarFieldEnum = (typeof EducationCostScalarFieldEnum)[keyof typeof EducationCostScalarFieldEnum]


  export const FatherScalarFieldEnum: {
    id: 'id',
    studentId: 'studentId',
    name: 'name',
    status: 'status',
    occupation: 'occupation',
    incomePerMonth: 'incomePerMonth',
    address: 'address',
    phone: 'phone',
    medicalHistory: 'medicalHistory'
  };

  export type FatherScalarFieldEnum = (typeof FatherScalarFieldEnum)[keyof typeof FatherScalarFieldEnum]


  export const MotherScalarFieldEnum: {
    id: 'id',
    studentId: 'studentId',
    name: 'name',
    status: 'status',
    occupation: 'occupation',
    incomePerMonth: 'incomePerMonth',
    address: 'address',
    phone: 'phone',
    medicalHistory: 'medicalHistory'
  };

  export type MotherScalarFieldEnum = (typeof MotherScalarFieldEnum)[keyof typeof MotherScalarFieldEnum]


  export const GuardianScalarFieldEnum: {
    id: 'id',
    studentId: 'studentId',
    name: 'name',
    status: 'status',
    occupation: 'occupation',
    incomePerMonth: 'incomePerMonth',
    address: 'address',
    phone: 'phone',
    medicalHistory: 'medicalHistory'
  };

  export type GuardianScalarFieldEnum = (typeof GuardianScalarFieldEnum)[keyof typeof GuardianScalarFieldEnum]


  export const DocumentScalarFieldEnum: {
    id: 'id',
    studentId: 'studentId',
    type: 'type',
    fileUrl: 'fileUrl',
    uploadedAt: 'uploadedAt'
  };

  export type DocumentScalarFieldEnum = (typeof DocumentScalarFieldEnum)[keyof typeof DocumentScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type PengawasWhereInput = {
    AND?: PengawasWhereInput | PengawasWhereInput[]
    OR?: PengawasWhereInput[]
    NOT?: PengawasWhereInput | PengawasWhereInput[]
    id?: IntFilter<"Pengawas"> | number
    username?: StringFilter<"Pengawas"> | string
    password?: StringFilter<"Pengawas"> | string
    name?: StringFilter<"Pengawas"> | string
    wilayah?: StringFilter<"Pengawas"> | string
    students?: StudentListRelationFilter
  }

  export type PengawasOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    name?: SortOrder
    wilayah?: SortOrder
    students?: StudentOrderByRelationAggregateInput
  }

  export type PengawasWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    username?: string
    AND?: PengawasWhereInput | PengawasWhereInput[]
    OR?: PengawasWhereInput[]
    NOT?: PengawasWhereInput | PengawasWhereInput[]
    password?: StringFilter<"Pengawas"> | string
    name?: StringFilter<"Pengawas"> | string
    wilayah?: StringFilter<"Pengawas"> | string
    students?: StudentListRelationFilter
  }, "id" | "username">

  export type PengawasOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    name?: SortOrder
    wilayah?: SortOrder
    _count?: PengawasCountOrderByAggregateInput
    _avg?: PengawasAvgOrderByAggregateInput
    _max?: PengawasMaxOrderByAggregateInput
    _min?: PengawasMinOrderByAggregateInput
    _sum?: PengawasSumOrderByAggregateInput
  }

  export type PengawasScalarWhereWithAggregatesInput = {
    AND?: PengawasScalarWhereWithAggregatesInput | PengawasScalarWhereWithAggregatesInput[]
    OR?: PengawasScalarWhereWithAggregatesInput[]
    NOT?: PengawasScalarWhereWithAggregatesInput | PengawasScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Pengawas"> | number
    username?: StringWithAggregatesFilter<"Pengawas"> | string
    password?: StringWithAggregatesFilter<"Pengawas"> | string
    name?: StringWithAggregatesFilter<"Pengawas"> | string
    wilayah?: StringWithAggregatesFilter<"Pengawas"> | string
  }

  export type StudentWhereInput = {
    AND?: StudentWhereInput | StudentWhereInput[]
    OR?: StudentWhereInput[]
    NOT?: StudentWhereInput | StudentWhereInput[]
    id?: IntFilter<"Student"> | number
    username?: StringFilter<"Student"> | string
    nik?: StringFilter<"Student"> | string
    fullName?: StringFilter<"Student"> | string
    dateOfBirth?: DateTimeFilter<"Student"> | Date | string
    gender?: StringFilter<"Student"> | string
    citaCita?: StringFilter<"Student"> | string
    wilayah?: StringFilter<"Student"> | string
    pengawasId?: IntFilter<"Student"> | number
    alamatLengkap?: StringFilter<"Student"> | string
    noHp?: StringFilter<"Student"> | string
    riwayatPenyakit?: StringFilter<"Student"> | string
    schoolName?: StringFilter<"Student"> | string
    gradeLevel?: StringFilter<"Student"> | string
    nilaiRataRata?: StringFilter<"Student"> | string
    jumlahSaudara?: IntFilter<"Student"> | number
    createdAt?: DateTimeFilter<"Student"> | Date | string
    pengawas?: XOR<PengawasScalarRelationFilter, PengawasWhereInput>
    father?: XOR<FatherNullableScalarRelationFilter, FatherWhereInput> | null
    mother?: XOR<MotherNullableScalarRelationFilter, MotherWhereInput> | null
    guardian?: XOR<GuardianNullableScalarRelationFilter, GuardianWhereInput> | null
    educationCosts?: EducationCostListRelationFilter
    documents?: DocumentListRelationFilter
  }

  export type StudentOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    nik?: SortOrder
    fullName?: SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    citaCita?: SortOrder
    wilayah?: SortOrder
    pengawasId?: SortOrder
    alamatLengkap?: SortOrder
    noHp?: SortOrder
    riwayatPenyakit?: SortOrder
    schoolName?: SortOrder
    gradeLevel?: SortOrder
    nilaiRataRata?: SortOrder
    jumlahSaudara?: SortOrder
    createdAt?: SortOrder
    pengawas?: PengawasOrderByWithRelationInput
    father?: FatherOrderByWithRelationInput
    mother?: MotherOrderByWithRelationInput
    guardian?: GuardianOrderByWithRelationInput
    educationCosts?: EducationCostOrderByRelationAggregateInput
    documents?: DocumentOrderByRelationAggregateInput
  }

  export type StudentWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    username?: string
    nik?: string
    AND?: StudentWhereInput | StudentWhereInput[]
    OR?: StudentWhereInput[]
    NOT?: StudentWhereInput | StudentWhereInput[]
    fullName?: StringFilter<"Student"> | string
    dateOfBirth?: DateTimeFilter<"Student"> | Date | string
    gender?: StringFilter<"Student"> | string
    citaCita?: StringFilter<"Student"> | string
    wilayah?: StringFilter<"Student"> | string
    pengawasId?: IntFilter<"Student"> | number
    alamatLengkap?: StringFilter<"Student"> | string
    noHp?: StringFilter<"Student"> | string
    riwayatPenyakit?: StringFilter<"Student"> | string
    schoolName?: StringFilter<"Student"> | string
    gradeLevel?: StringFilter<"Student"> | string
    nilaiRataRata?: StringFilter<"Student"> | string
    jumlahSaudara?: IntFilter<"Student"> | number
    createdAt?: DateTimeFilter<"Student"> | Date | string
    pengawas?: XOR<PengawasScalarRelationFilter, PengawasWhereInput>
    father?: XOR<FatherNullableScalarRelationFilter, FatherWhereInput> | null
    mother?: XOR<MotherNullableScalarRelationFilter, MotherWhereInput> | null
    guardian?: XOR<GuardianNullableScalarRelationFilter, GuardianWhereInput> | null
    educationCosts?: EducationCostListRelationFilter
    documents?: DocumentListRelationFilter
  }, "id" | "username" | "nik">

  export type StudentOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    nik?: SortOrder
    fullName?: SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    citaCita?: SortOrder
    wilayah?: SortOrder
    pengawasId?: SortOrder
    alamatLengkap?: SortOrder
    noHp?: SortOrder
    riwayatPenyakit?: SortOrder
    schoolName?: SortOrder
    gradeLevel?: SortOrder
    nilaiRataRata?: SortOrder
    jumlahSaudara?: SortOrder
    createdAt?: SortOrder
    _count?: StudentCountOrderByAggregateInput
    _avg?: StudentAvgOrderByAggregateInput
    _max?: StudentMaxOrderByAggregateInput
    _min?: StudentMinOrderByAggregateInput
    _sum?: StudentSumOrderByAggregateInput
  }

  export type StudentScalarWhereWithAggregatesInput = {
    AND?: StudentScalarWhereWithAggregatesInput | StudentScalarWhereWithAggregatesInput[]
    OR?: StudentScalarWhereWithAggregatesInput[]
    NOT?: StudentScalarWhereWithAggregatesInput | StudentScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Student"> | number
    username?: StringWithAggregatesFilter<"Student"> | string
    nik?: StringWithAggregatesFilter<"Student"> | string
    fullName?: StringWithAggregatesFilter<"Student"> | string
    dateOfBirth?: DateTimeWithAggregatesFilter<"Student"> | Date | string
    gender?: StringWithAggregatesFilter<"Student"> | string
    citaCita?: StringWithAggregatesFilter<"Student"> | string
    wilayah?: StringWithAggregatesFilter<"Student"> | string
    pengawasId?: IntWithAggregatesFilter<"Student"> | number
    alamatLengkap?: StringWithAggregatesFilter<"Student"> | string
    noHp?: StringWithAggregatesFilter<"Student"> | string
    riwayatPenyakit?: StringWithAggregatesFilter<"Student"> | string
    schoolName?: StringWithAggregatesFilter<"Student"> | string
    gradeLevel?: StringWithAggregatesFilter<"Student"> | string
    nilaiRataRata?: StringWithAggregatesFilter<"Student"> | string
    jumlahSaudara?: IntWithAggregatesFilter<"Student"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Student"> | Date | string
  }

  export type EducationCostWhereInput = {
    AND?: EducationCostWhereInput | EducationCostWhereInput[]
    OR?: EducationCostWhereInput[]
    NOT?: EducationCostWhereInput | EducationCostWhereInput[]
    id?: IntFilter<"EducationCost"> | number
    studentId?: IntFilter<"EducationCost"> | number
    label?: StringFilter<"EducationCost"> | string
    amount?: IntFilter<"EducationCost"> | number
    student?: XOR<StudentScalarRelationFilter, StudentWhereInput>
  }

  export type EducationCostOrderByWithRelationInput = {
    id?: SortOrder
    studentId?: SortOrder
    label?: SortOrder
    amount?: SortOrder
    student?: StudentOrderByWithRelationInput
  }

  export type EducationCostWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: EducationCostWhereInput | EducationCostWhereInput[]
    OR?: EducationCostWhereInput[]
    NOT?: EducationCostWhereInput | EducationCostWhereInput[]
    studentId?: IntFilter<"EducationCost"> | number
    label?: StringFilter<"EducationCost"> | string
    amount?: IntFilter<"EducationCost"> | number
    student?: XOR<StudentScalarRelationFilter, StudentWhereInput>
  }, "id">

  export type EducationCostOrderByWithAggregationInput = {
    id?: SortOrder
    studentId?: SortOrder
    label?: SortOrder
    amount?: SortOrder
    _count?: EducationCostCountOrderByAggregateInput
    _avg?: EducationCostAvgOrderByAggregateInput
    _max?: EducationCostMaxOrderByAggregateInput
    _min?: EducationCostMinOrderByAggregateInput
    _sum?: EducationCostSumOrderByAggregateInput
  }

  export type EducationCostScalarWhereWithAggregatesInput = {
    AND?: EducationCostScalarWhereWithAggregatesInput | EducationCostScalarWhereWithAggregatesInput[]
    OR?: EducationCostScalarWhereWithAggregatesInput[]
    NOT?: EducationCostScalarWhereWithAggregatesInput | EducationCostScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"EducationCost"> | number
    studentId?: IntWithAggregatesFilter<"EducationCost"> | number
    label?: StringWithAggregatesFilter<"EducationCost"> | string
    amount?: IntWithAggregatesFilter<"EducationCost"> | number
  }

  export type FatherWhereInput = {
    AND?: FatherWhereInput | FatherWhereInput[]
    OR?: FatherWhereInput[]
    NOT?: FatherWhereInput | FatherWhereInput[]
    id?: IntFilter<"Father"> | number
    studentId?: IntFilter<"Father"> | number
    name?: StringFilter<"Father"> | string
    status?: StringFilter<"Father"> | string
    occupation?: StringFilter<"Father"> | string
    incomePerMonth?: StringFilter<"Father"> | string
    address?: StringFilter<"Father"> | string
    phone?: StringFilter<"Father"> | string
    medicalHistory?: StringFilter<"Father"> | string
    student?: XOR<StudentScalarRelationFilter, StudentWhereInput>
  }

  export type FatherOrderByWithRelationInput = {
    id?: SortOrder
    studentId?: SortOrder
    name?: SortOrder
    status?: SortOrder
    occupation?: SortOrder
    incomePerMonth?: SortOrder
    address?: SortOrder
    phone?: SortOrder
    medicalHistory?: SortOrder
    student?: StudentOrderByWithRelationInput
  }

  export type FatherWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    studentId?: number
    AND?: FatherWhereInput | FatherWhereInput[]
    OR?: FatherWhereInput[]
    NOT?: FatherWhereInput | FatherWhereInput[]
    name?: StringFilter<"Father"> | string
    status?: StringFilter<"Father"> | string
    occupation?: StringFilter<"Father"> | string
    incomePerMonth?: StringFilter<"Father"> | string
    address?: StringFilter<"Father"> | string
    phone?: StringFilter<"Father"> | string
    medicalHistory?: StringFilter<"Father"> | string
    student?: XOR<StudentScalarRelationFilter, StudentWhereInput>
  }, "id" | "studentId">

  export type FatherOrderByWithAggregationInput = {
    id?: SortOrder
    studentId?: SortOrder
    name?: SortOrder
    status?: SortOrder
    occupation?: SortOrder
    incomePerMonth?: SortOrder
    address?: SortOrder
    phone?: SortOrder
    medicalHistory?: SortOrder
    _count?: FatherCountOrderByAggregateInput
    _avg?: FatherAvgOrderByAggregateInput
    _max?: FatherMaxOrderByAggregateInput
    _min?: FatherMinOrderByAggregateInput
    _sum?: FatherSumOrderByAggregateInput
  }

  export type FatherScalarWhereWithAggregatesInput = {
    AND?: FatherScalarWhereWithAggregatesInput | FatherScalarWhereWithAggregatesInput[]
    OR?: FatherScalarWhereWithAggregatesInput[]
    NOT?: FatherScalarWhereWithAggregatesInput | FatherScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Father"> | number
    studentId?: IntWithAggregatesFilter<"Father"> | number
    name?: StringWithAggregatesFilter<"Father"> | string
    status?: StringWithAggregatesFilter<"Father"> | string
    occupation?: StringWithAggregatesFilter<"Father"> | string
    incomePerMonth?: StringWithAggregatesFilter<"Father"> | string
    address?: StringWithAggregatesFilter<"Father"> | string
    phone?: StringWithAggregatesFilter<"Father"> | string
    medicalHistory?: StringWithAggregatesFilter<"Father"> | string
  }

  export type MotherWhereInput = {
    AND?: MotherWhereInput | MotherWhereInput[]
    OR?: MotherWhereInput[]
    NOT?: MotherWhereInput | MotherWhereInput[]
    id?: IntFilter<"Mother"> | number
    studentId?: IntFilter<"Mother"> | number
    name?: StringFilter<"Mother"> | string
    status?: StringFilter<"Mother"> | string
    occupation?: StringFilter<"Mother"> | string
    incomePerMonth?: StringFilter<"Mother"> | string
    address?: StringFilter<"Mother"> | string
    phone?: StringFilter<"Mother"> | string
    medicalHistory?: StringFilter<"Mother"> | string
    student?: XOR<StudentScalarRelationFilter, StudentWhereInput>
  }

  export type MotherOrderByWithRelationInput = {
    id?: SortOrder
    studentId?: SortOrder
    name?: SortOrder
    status?: SortOrder
    occupation?: SortOrder
    incomePerMonth?: SortOrder
    address?: SortOrder
    phone?: SortOrder
    medicalHistory?: SortOrder
    student?: StudentOrderByWithRelationInput
  }

  export type MotherWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    studentId?: number
    AND?: MotherWhereInput | MotherWhereInput[]
    OR?: MotherWhereInput[]
    NOT?: MotherWhereInput | MotherWhereInput[]
    name?: StringFilter<"Mother"> | string
    status?: StringFilter<"Mother"> | string
    occupation?: StringFilter<"Mother"> | string
    incomePerMonth?: StringFilter<"Mother"> | string
    address?: StringFilter<"Mother"> | string
    phone?: StringFilter<"Mother"> | string
    medicalHistory?: StringFilter<"Mother"> | string
    student?: XOR<StudentScalarRelationFilter, StudentWhereInput>
  }, "id" | "studentId">

  export type MotherOrderByWithAggregationInput = {
    id?: SortOrder
    studentId?: SortOrder
    name?: SortOrder
    status?: SortOrder
    occupation?: SortOrder
    incomePerMonth?: SortOrder
    address?: SortOrder
    phone?: SortOrder
    medicalHistory?: SortOrder
    _count?: MotherCountOrderByAggregateInput
    _avg?: MotherAvgOrderByAggregateInput
    _max?: MotherMaxOrderByAggregateInput
    _min?: MotherMinOrderByAggregateInput
    _sum?: MotherSumOrderByAggregateInput
  }

  export type MotherScalarWhereWithAggregatesInput = {
    AND?: MotherScalarWhereWithAggregatesInput | MotherScalarWhereWithAggregatesInput[]
    OR?: MotherScalarWhereWithAggregatesInput[]
    NOT?: MotherScalarWhereWithAggregatesInput | MotherScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Mother"> | number
    studentId?: IntWithAggregatesFilter<"Mother"> | number
    name?: StringWithAggregatesFilter<"Mother"> | string
    status?: StringWithAggregatesFilter<"Mother"> | string
    occupation?: StringWithAggregatesFilter<"Mother"> | string
    incomePerMonth?: StringWithAggregatesFilter<"Mother"> | string
    address?: StringWithAggregatesFilter<"Mother"> | string
    phone?: StringWithAggregatesFilter<"Mother"> | string
    medicalHistory?: StringWithAggregatesFilter<"Mother"> | string
  }

  export type GuardianWhereInput = {
    AND?: GuardianWhereInput | GuardianWhereInput[]
    OR?: GuardianWhereInput[]
    NOT?: GuardianWhereInput | GuardianWhereInput[]
    id?: IntFilter<"Guardian"> | number
    studentId?: IntFilter<"Guardian"> | number
    name?: StringFilter<"Guardian"> | string
    status?: StringFilter<"Guardian"> | string
    occupation?: StringFilter<"Guardian"> | string
    incomePerMonth?: StringFilter<"Guardian"> | string
    address?: StringFilter<"Guardian"> | string
    phone?: StringFilter<"Guardian"> | string
    medicalHistory?: StringFilter<"Guardian"> | string
    student?: XOR<StudentScalarRelationFilter, StudentWhereInput>
  }

  export type GuardianOrderByWithRelationInput = {
    id?: SortOrder
    studentId?: SortOrder
    name?: SortOrder
    status?: SortOrder
    occupation?: SortOrder
    incomePerMonth?: SortOrder
    address?: SortOrder
    phone?: SortOrder
    medicalHistory?: SortOrder
    student?: StudentOrderByWithRelationInput
  }

  export type GuardianWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    studentId?: number
    AND?: GuardianWhereInput | GuardianWhereInput[]
    OR?: GuardianWhereInput[]
    NOT?: GuardianWhereInput | GuardianWhereInput[]
    name?: StringFilter<"Guardian"> | string
    status?: StringFilter<"Guardian"> | string
    occupation?: StringFilter<"Guardian"> | string
    incomePerMonth?: StringFilter<"Guardian"> | string
    address?: StringFilter<"Guardian"> | string
    phone?: StringFilter<"Guardian"> | string
    medicalHistory?: StringFilter<"Guardian"> | string
    student?: XOR<StudentScalarRelationFilter, StudentWhereInput>
  }, "id" | "studentId">

  export type GuardianOrderByWithAggregationInput = {
    id?: SortOrder
    studentId?: SortOrder
    name?: SortOrder
    status?: SortOrder
    occupation?: SortOrder
    incomePerMonth?: SortOrder
    address?: SortOrder
    phone?: SortOrder
    medicalHistory?: SortOrder
    _count?: GuardianCountOrderByAggregateInput
    _avg?: GuardianAvgOrderByAggregateInput
    _max?: GuardianMaxOrderByAggregateInput
    _min?: GuardianMinOrderByAggregateInput
    _sum?: GuardianSumOrderByAggregateInput
  }

  export type GuardianScalarWhereWithAggregatesInput = {
    AND?: GuardianScalarWhereWithAggregatesInput | GuardianScalarWhereWithAggregatesInput[]
    OR?: GuardianScalarWhereWithAggregatesInput[]
    NOT?: GuardianScalarWhereWithAggregatesInput | GuardianScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Guardian"> | number
    studentId?: IntWithAggregatesFilter<"Guardian"> | number
    name?: StringWithAggregatesFilter<"Guardian"> | string
    status?: StringWithAggregatesFilter<"Guardian"> | string
    occupation?: StringWithAggregatesFilter<"Guardian"> | string
    incomePerMonth?: StringWithAggregatesFilter<"Guardian"> | string
    address?: StringWithAggregatesFilter<"Guardian"> | string
    phone?: StringWithAggregatesFilter<"Guardian"> | string
    medicalHistory?: StringWithAggregatesFilter<"Guardian"> | string
  }

  export type DocumentWhereInput = {
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    id?: IntFilter<"Document"> | number
    studentId?: IntFilter<"Document"> | number
    type?: StringFilter<"Document"> | string
    fileUrl?: StringFilter<"Document"> | string
    uploadedAt?: DateTimeFilter<"Document"> | Date | string
    student?: XOR<StudentScalarRelationFilter, StudentWhereInput>
  }

  export type DocumentOrderByWithRelationInput = {
    id?: SortOrder
    studentId?: SortOrder
    type?: SortOrder
    fileUrl?: SortOrder
    uploadedAt?: SortOrder
    student?: StudentOrderByWithRelationInput
  }

  export type DocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    studentId?: IntFilter<"Document"> | number
    type?: StringFilter<"Document"> | string
    fileUrl?: StringFilter<"Document"> | string
    uploadedAt?: DateTimeFilter<"Document"> | Date | string
    student?: XOR<StudentScalarRelationFilter, StudentWhereInput>
  }, "id">

  export type DocumentOrderByWithAggregationInput = {
    id?: SortOrder
    studentId?: SortOrder
    type?: SortOrder
    fileUrl?: SortOrder
    uploadedAt?: SortOrder
    _count?: DocumentCountOrderByAggregateInput
    _avg?: DocumentAvgOrderByAggregateInput
    _max?: DocumentMaxOrderByAggregateInput
    _min?: DocumentMinOrderByAggregateInput
    _sum?: DocumentSumOrderByAggregateInput
  }

  export type DocumentScalarWhereWithAggregatesInput = {
    AND?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    OR?: DocumentScalarWhereWithAggregatesInput[]
    NOT?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Document"> | number
    studentId?: IntWithAggregatesFilter<"Document"> | number
    type?: StringWithAggregatesFilter<"Document"> | string
    fileUrl?: StringWithAggregatesFilter<"Document"> | string
    uploadedAt?: DateTimeWithAggregatesFilter<"Document"> | Date | string
  }

  export type PengawasCreateInput = {
    username: string
    password: string
    name: string
    wilayah: string
    students?: StudentCreateNestedManyWithoutPengawasInput
  }

  export type PengawasUncheckedCreateInput = {
    id?: number
    username: string
    password: string
    name: string
    wilayah: string
    students?: StudentUncheckedCreateNestedManyWithoutPengawasInput
  }

  export type PengawasUpdateInput = {
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    wilayah?: StringFieldUpdateOperationsInput | string
    students?: StudentUpdateManyWithoutPengawasNestedInput
  }

  export type PengawasUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    wilayah?: StringFieldUpdateOperationsInput | string
    students?: StudentUncheckedUpdateManyWithoutPengawasNestedInput
  }

  export type PengawasCreateManyInput = {
    id?: number
    username: string
    password: string
    name: string
    wilayah: string
  }

  export type PengawasUpdateManyMutationInput = {
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    wilayah?: StringFieldUpdateOperationsInput | string
  }

  export type PengawasUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    wilayah?: StringFieldUpdateOperationsInput | string
  }

  export type StudentCreateInput = {
    username: string
    nik: string
    fullName: string
    dateOfBirth: Date | string
    gender: string
    citaCita: string
    wilayah: string
    alamatLengkap: string
    noHp: string
    riwayatPenyakit: string
    schoolName: string
    gradeLevel: string
    nilaiRataRata: string
    jumlahSaudara: number
    createdAt?: Date | string
    pengawas: PengawasCreateNestedOneWithoutStudentsInput
    father?: FatherCreateNestedOneWithoutStudentInput
    mother?: MotherCreateNestedOneWithoutStudentInput
    guardian?: GuardianCreateNestedOneWithoutStudentInput
    educationCosts?: EducationCostCreateNestedManyWithoutStudentInput
    documents?: DocumentCreateNestedManyWithoutStudentInput
  }

  export type StudentUncheckedCreateInput = {
    id?: number
    username: string
    nik: string
    fullName: string
    dateOfBirth: Date | string
    gender: string
    citaCita: string
    wilayah: string
    pengawasId: number
    alamatLengkap: string
    noHp: string
    riwayatPenyakit: string
    schoolName: string
    gradeLevel: string
    nilaiRataRata: string
    jumlahSaudara: number
    createdAt?: Date | string
    father?: FatherUncheckedCreateNestedOneWithoutStudentInput
    mother?: MotherUncheckedCreateNestedOneWithoutStudentInput
    guardian?: GuardianUncheckedCreateNestedOneWithoutStudentInput
    educationCosts?: EducationCostUncheckedCreateNestedManyWithoutStudentInput
    documents?: DocumentUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentUpdateInput = {
    username?: StringFieldUpdateOperationsInput | string
    nik?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    citaCita?: StringFieldUpdateOperationsInput | string
    wilayah?: StringFieldUpdateOperationsInput | string
    alamatLengkap?: StringFieldUpdateOperationsInput | string
    noHp?: StringFieldUpdateOperationsInput | string
    riwayatPenyakit?: StringFieldUpdateOperationsInput | string
    schoolName?: StringFieldUpdateOperationsInput | string
    gradeLevel?: StringFieldUpdateOperationsInput | string
    nilaiRataRata?: StringFieldUpdateOperationsInput | string
    jumlahSaudara?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pengawas?: PengawasUpdateOneRequiredWithoutStudentsNestedInput
    father?: FatherUpdateOneWithoutStudentNestedInput
    mother?: MotherUpdateOneWithoutStudentNestedInput
    guardian?: GuardianUpdateOneWithoutStudentNestedInput
    educationCosts?: EducationCostUpdateManyWithoutStudentNestedInput
    documents?: DocumentUpdateManyWithoutStudentNestedInput
  }

  export type StudentUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    nik?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    citaCita?: StringFieldUpdateOperationsInput | string
    wilayah?: StringFieldUpdateOperationsInput | string
    pengawasId?: IntFieldUpdateOperationsInput | number
    alamatLengkap?: StringFieldUpdateOperationsInput | string
    noHp?: StringFieldUpdateOperationsInput | string
    riwayatPenyakit?: StringFieldUpdateOperationsInput | string
    schoolName?: StringFieldUpdateOperationsInput | string
    gradeLevel?: StringFieldUpdateOperationsInput | string
    nilaiRataRata?: StringFieldUpdateOperationsInput | string
    jumlahSaudara?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    father?: FatherUncheckedUpdateOneWithoutStudentNestedInput
    mother?: MotherUncheckedUpdateOneWithoutStudentNestedInput
    guardian?: GuardianUncheckedUpdateOneWithoutStudentNestedInput
    educationCosts?: EducationCostUncheckedUpdateManyWithoutStudentNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type StudentCreateManyInput = {
    id?: number
    username: string
    nik: string
    fullName: string
    dateOfBirth: Date | string
    gender: string
    citaCita: string
    wilayah: string
    pengawasId: number
    alamatLengkap: string
    noHp: string
    riwayatPenyakit: string
    schoolName: string
    gradeLevel: string
    nilaiRataRata: string
    jumlahSaudara: number
    createdAt?: Date | string
  }

  export type StudentUpdateManyMutationInput = {
    username?: StringFieldUpdateOperationsInput | string
    nik?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    citaCita?: StringFieldUpdateOperationsInput | string
    wilayah?: StringFieldUpdateOperationsInput | string
    alamatLengkap?: StringFieldUpdateOperationsInput | string
    noHp?: StringFieldUpdateOperationsInput | string
    riwayatPenyakit?: StringFieldUpdateOperationsInput | string
    schoolName?: StringFieldUpdateOperationsInput | string
    gradeLevel?: StringFieldUpdateOperationsInput | string
    nilaiRataRata?: StringFieldUpdateOperationsInput | string
    jumlahSaudara?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StudentUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    nik?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    citaCita?: StringFieldUpdateOperationsInput | string
    wilayah?: StringFieldUpdateOperationsInput | string
    pengawasId?: IntFieldUpdateOperationsInput | number
    alamatLengkap?: StringFieldUpdateOperationsInput | string
    noHp?: StringFieldUpdateOperationsInput | string
    riwayatPenyakit?: StringFieldUpdateOperationsInput | string
    schoolName?: StringFieldUpdateOperationsInput | string
    gradeLevel?: StringFieldUpdateOperationsInput | string
    nilaiRataRata?: StringFieldUpdateOperationsInput | string
    jumlahSaudara?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EducationCostCreateInput = {
    label: string
    amount: number
    student: StudentCreateNestedOneWithoutEducationCostsInput
  }

  export type EducationCostUncheckedCreateInput = {
    id?: number
    studentId: number
    label: string
    amount: number
  }

  export type EducationCostUpdateInput = {
    label?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
    student?: StudentUpdateOneRequiredWithoutEducationCostsNestedInput
  }

  export type EducationCostUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    studentId?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
  }

  export type EducationCostCreateManyInput = {
    id?: number
    studentId: number
    label: string
    amount: number
  }

  export type EducationCostUpdateManyMutationInput = {
    label?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
  }

  export type EducationCostUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    studentId?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
  }

  export type FatherCreateInput = {
    name: string
    status: string
    occupation: string
    incomePerMonth: string
    address: string
    phone: string
    medicalHistory: string
    student: StudentCreateNestedOneWithoutFatherInput
  }

  export type FatherUncheckedCreateInput = {
    id?: number
    studentId: number
    name: string
    status: string
    occupation: string
    incomePerMonth: string
    address: string
    phone: string
    medicalHistory: string
  }

  export type FatherUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    occupation?: StringFieldUpdateOperationsInput | string
    incomePerMonth?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    medicalHistory?: StringFieldUpdateOperationsInput | string
    student?: StudentUpdateOneRequiredWithoutFatherNestedInput
  }

  export type FatherUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    studentId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    occupation?: StringFieldUpdateOperationsInput | string
    incomePerMonth?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    medicalHistory?: StringFieldUpdateOperationsInput | string
  }

  export type FatherCreateManyInput = {
    id?: number
    studentId: number
    name: string
    status: string
    occupation: string
    incomePerMonth: string
    address: string
    phone: string
    medicalHistory: string
  }

  export type FatherUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    occupation?: StringFieldUpdateOperationsInput | string
    incomePerMonth?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    medicalHistory?: StringFieldUpdateOperationsInput | string
  }

  export type FatherUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    studentId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    occupation?: StringFieldUpdateOperationsInput | string
    incomePerMonth?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    medicalHistory?: StringFieldUpdateOperationsInput | string
  }

  export type MotherCreateInput = {
    name: string
    status: string
    occupation: string
    incomePerMonth: string
    address: string
    phone: string
    medicalHistory: string
    student: StudentCreateNestedOneWithoutMotherInput
  }

  export type MotherUncheckedCreateInput = {
    id?: number
    studentId: number
    name: string
    status: string
    occupation: string
    incomePerMonth: string
    address: string
    phone: string
    medicalHistory: string
  }

  export type MotherUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    occupation?: StringFieldUpdateOperationsInput | string
    incomePerMonth?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    medicalHistory?: StringFieldUpdateOperationsInput | string
    student?: StudentUpdateOneRequiredWithoutMotherNestedInput
  }

  export type MotherUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    studentId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    occupation?: StringFieldUpdateOperationsInput | string
    incomePerMonth?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    medicalHistory?: StringFieldUpdateOperationsInput | string
  }

  export type MotherCreateManyInput = {
    id?: number
    studentId: number
    name: string
    status: string
    occupation: string
    incomePerMonth: string
    address: string
    phone: string
    medicalHistory: string
  }

  export type MotherUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    occupation?: StringFieldUpdateOperationsInput | string
    incomePerMonth?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    medicalHistory?: StringFieldUpdateOperationsInput | string
  }

  export type MotherUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    studentId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    occupation?: StringFieldUpdateOperationsInput | string
    incomePerMonth?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    medicalHistory?: StringFieldUpdateOperationsInput | string
  }

  export type GuardianCreateInput = {
    name: string
    status: string
    occupation: string
    incomePerMonth: string
    address: string
    phone: string
    medicalHistory: string
    student: StudentCreateNestedOneWithoutGuardianInput
  }

  export type GuardianUncheckedCreateInput = {
    id?: number
    studentId: number
    name: string
    status: string
    occupation: string
    incomePerMonth: string
    address: string
    phone: string
    medicalHistory: string
  }

  export type GuardianUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    occupation?: StringFieldUpdateOperationsInput | string
    incomePerMonth?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    medicalHistory?: StringFieldUpdateOperationsInput | string
    student?: StudentUpdateOneRequiredWithoutGuardianNestedInput
  }

  export type GuardianUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    studentId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    occupation?: StringFieldUpdateOperationsInput | string
    incomePerMonth?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    medicalHistory?: StringFieldUpdateOperationsInput | string
  }

  export type GuardianCreateManyInput = {
    id?: number
    studentId: number
    name: string
    status: string
    occupation: string
    incomePerMonth: string
    address: string
    phone: string
    medicalHistory: string
  }

  export type GuardianUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    occupation?: StringFieldUpdateOperationsInput | string
    incomePerMonth?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    medicalHistory?: StringFieldUpdateOperationsInput | string
  }

  export type GuardianUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    studentId?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    occupation?: StringFieldUpdateOperationsInput | string
    incomePerMonth?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    medicalHistory?: StringFieldUpdateOperationsInput | string
  }

  export type DocumentCreateInput = {
    type: string
    fileUrl: string
    uploadedAt?: Date | string
    student: StudentCreateNestedOneWithoutDocumentsInput
  }

  export type DocumentUncheckedCreateInput = {
    id?: number
    studentId: number
    type: string
    fileUrl: string
    uploadedAt?: Date | string
  }

  export type DocumentUpdateInput = {
    type?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    student?: StudentUpdateOneRequiredWithoutDocumentsNestedInput
  }

  export type DocumentUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    studentId?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentCreateManyInput = {
    id?: number
    studentId: number
    type: string
    fileUrl: string
    uploadedAt?: Date | string
  }

  export type DocumentUpdateManyMutationInput = {
    type?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    studentId?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StudentListRelationFilter = {
    every?: StudentWhereInput
    some?: StudentWhereInput
    none?: StudentWhereInput
  }

  export type StudentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PengawasCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    name?: SortOrder
    wilayah?: SortOrder
  }

  export type PengawasAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type PengawasMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    name?: SortOrder
    wilayah?: SortOrder
  }

  export type PengawasMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    name?: SortOrder
    wilayah?: SortOrder
  }

  export type PengawasSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type PengawasScalarRelationFilter = {
    is?: PengawasWhereInput
    isNot?: PengawasWhereInput
  }

  export type FatherNullableScalarRelationFilter = {
    is?: FatherWhereInput | null
    isNot?: FatherWhereInput | null
  }

  export type MotherNullableScalarRelationFilter = {
    is?: MotherWhereInput | null
    isNot?: MotherWhereInput | null
  }

  export type GuardianNullableScalarRelationFilter = {
    is?: GuardianWhereInput | null
    isNot?: GuardianWhereInput | null
  }

  export type EducationCostListRelationFilter = {
    every?: EducationCostWhereInput
    some?: EducationCostWhereInput
    none?: EducationCostWhereInput
  }

  export type DocumentListRelationFilter = {
    every?: DocumentWhereInput
    some?: DocumentWhereInput
    none?: DocumentWhereInput
  }

  export type EducationCostOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DocumentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type StudentCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    nik?: SortOrder
    fullName?: SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    citaCita?: SortOrder
    wilayah?: SortOrder
    pengawasId?: SortOrder
    alamatLengkap?: SortOrder
    noHp?: SortOrder
    riwayatPenyakit?: SortOrder
    schoolName?: SortOrder
    gradeLevel?: SortOrder
    nilaiRataRata?: SortOrder
    jumlahSaudara?: SortOrder
    createdAt?: SortOrder
  }

  export type StudentAvgOrderByAggregateInput = {
    id?: SortOrder
    pengawasId?: SortOrder
    jumlahSaudara?: SortOrder
  }

  export type StudentMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    nik?: SortOrder
    fullName?: SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    citaCita?: SortOrder
    wilayah?: SortOrder
    pengawasId?: SortOrder
    alamatLengkap?: SortOrder
    noHp?: SortOrder
    riwayatPenyakit?: SortOrder
    schoolName?: SortOrder
    gradeLevel?: SortOrder
    nilaiRataRata?: SortOrder
    jumlahSaudara?: SortOrder
    createdAt?: SortOrder
  }

  export type StudentMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    nik?: SortOrder
    fullName?: SortOrder
    dateOfBirth?: SortOrder
    gender?: SortOrder
    citaCita?: SortOrder
    wilayah?: SortOrder
    pengawasId?: SortOrder
    alamatLengkap?: SortOrder
    noHp?: SortOrder
    riwayatPenyakit?: SortOrder
    schoolName?: SortOrder
    gradeLevel?: SortOrder
    nilaiRataRata?: SortOrder
    jumlahSaudara?: SortOrder
    createdAt?: SortOrder
  }

  export type StudentSumOrderByAggregateInput = {
    id?: SortOrder
    pengawasId?: SortOrder
    jumlahSaudara?: SortOrder
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StudentScalarRelationFilter = {
    is?: StudentWhereInput
    isNot?: StudentWhereInput
  }

  export type EducationCostCountOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    label?: SortOrder
    amount?: SortOrder
  }

  export type EducationCostAvgOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    amount?: SortOrder
  }

  export type EducationCostMaxOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    label?: SortOrder
    amount?: SortOrder
  }

  export type EducationCostMinOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    label?: SortOrder
    amount?: SortOrder
  }

  export type EducationCostSumOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    amount?: SortOrder
  }

  export type FatherCountOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    name?: SortOrder
    status?: SortOrder
    occupation?: SortOrder
    incomePerMonth?: SortOrder
    address?: SortOrder
    phone?: SortOrder
    medicalHistory?: SortOrder
  }

  export type FatherAvgOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
  }

  export type FatherMaxOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    name?: SortOrder
    status?: SortOrder
    occupation?: SortOrder
    incomePerMonth?: SortOrder
    address?: SortOrder
    phone?: SortOrder
    medicalHistory?: SortOrder
  }

  export type FatherMinOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    name?: SortOrder
    status?: SortOrder
    occupation?: SortOrder
    incomePerMonth?: SortOrder
    address?: SortOrder
    phone?: SortOrder
    medicalHistory?: SortOrder
  }

  export type FatherSumOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
  }

  export type MotherCountOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    name?: SortOrder
    status?: SortOrder
    occupation?: SortOrder
    incomePerMonth?: SortOrder
    address?: SortOrder
    phone?: SortOrder
    medicalHistory?: SortOrder
  }

  export type MotherAvgOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
  }

  export type MotherMaxOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    name?: SortOrder
    status?: SortOrder
    occupation?: SortOrder
    incomePerMonth?: SortOrder
    address?: SortOrder
    phone?: SortOrder
    medicalHistory?: SortOrder
  }

  export type MotherMinOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    name?: SortOrder
    status?: SortOrder
    occupation?: SortOrder
    incomePerMonth?: SortOrder
    address?: SortOrder
    phone?: SortOrder
    medicalHistory?: SortOrder
  }

  export type MotherSumOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
  }

  export type GuardianCountOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    name?: SortOrder
    status?: SortOrder
    occupation?: SortOrder
    incomePerMonth?: SortOrder
    address?: SortOrder
    phone?: SortOrder
    medicalHistory?: SortOrder
  }

  export type GuardianAvgOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
  }

  export type GuardianMaxOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    name?: SortOrder
    status?: SortOrder
    occupation?: SortOrder
    incomePerMonth?: SortOrder
    address?: SortOrder
    phone?: SortOrder
    medicalHistory?: SortOrder
  }

  export type GuardianMinOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    name?: SortOrder
    status?: SortOrder
    occupation?: SortOrder
    incomePerMonth?: SortOrder
    address?: SortOrder
    phone?: SortOrder
    medicalHistory?: SortOrder
  }

  export type GuardianSumOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
  }

  export type DocumentCountOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    type?: SortOrder
    fileUrl?: SortOrder
    uploadedAt?: SortOrder
  }

  export type DocumentAvgOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
  }

  export type DocumentMaxOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    type?: SortOrder
    fileUrl?: SortOrder
    uploadedAt?: SortOrder
  }

  export type DocumentMinOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    type?: SortOrder
    fileUrl?: SortOrder
    uploadedAt?: SortOrder
  }

  export type DocumentSumOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
  }

  export type StudentCreateNestedManyWithoutPengawasInput = {
    create?: XOR<StudentCreateWithoutPengawasInput, StudentUncheckedCreateWithoutPengawasInput> | StudentCreateWithoutPengawasInput[] | StudentUncheckedCreateWithoutPengawasInput[]
    connectOrCreate?: StudentCreateOrConnectWithoutPengawasInput | StudentCreateOrConnectWithoutPengawasInput[]
    createMany?: StudentCreateManyPengawasInputEnvelope
    connect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
  }

  export type StudentUncheckedCreateNestedManyWithoutPengawasInput = {
    create?: XOR<StudentCreateWithoutPengawasInput, StudentUncheckedCreateWithoutPengawasInput> | StudentCreateWithoutPengawasInput[] | StudentUncheckedCreateWithoutPengawasInput[]
    connectOrCreate?: StudentCreateOrConnectWithoutPengawasInput | StudentCreateOrConnectWithoutPengawasInput[]
    createMany?: StudentCreateManyPengawasInputEnvelope
    connect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type StudentUpdateManyWithoutPengawasNestedInput = {
    create?: XOR<StudentCreateWithoutPengawasInput, StudentUncheckedCreateWithoutPengawasInput> | StudentCreateWithoutPengawasInput[] | StudentUncheckedCreateWithoutPengawasInput[]
    connectOrCreate?: StudentCreateOrConnectWithoutPengawasInput | StudentCreateOrConnectWithoutPengawasInput[]
    upsert?: StudentUpsertWithWhereUniqueWithoutPengawasInput | StudentUpsertWithWhereUniqueWithoutPengawasInput[]
    createMany?: StudentCreateManyPengawasInputEnvelope
    set?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    disconnect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    delete?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    connect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    update?: StudentUpdateWithWhereUniqueWithoutPengawasInput | StudentUpdateWithWhereUniqueWithoutPengawasInput[]
    updateMany?: StudentUpdateManyWithWhereWithoutPengawasInput | StudentUpdateManyWithWhereWithoutPengawasInput[]
    deleteMany?: StudentScalarWhereInput | StudentScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type StudentUncheckedUpdateManyWithoutPengawasNestedInput = {
    create?: XOR<StudentCreateWithoutPengawasInput, StudentUncheckedCreateWithoutPengawasInput> | StudentCreateWithoutPengawasInput[] | StudentUncheckedCreateWithoutPengawasInput[]
    connectOrCreate?: StudentCreateOrConnectWithoutPengawasInput | StudentCreateOrConnectWithoutPengawasInput[]
    upsert?: StudentUpsertWithWhereUniqueWithoutPengawasInput | StudentUpsertWithWhereUniqueWithoutPengawasInput[]
    createMany?: StudentCreateManyPengawasInputEnvelope
    set?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    disconnect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    delete?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    connect?: StudentWhereUniqueInput | StudentWhereUniqueInput[]
    update?: StudentUpdateWithWhereUniqueWithoutPengawasInput | StudentUpdateWithWhereUniqueWithoutPengawasInput[]
    updateMany?: StudentUpdateManyWithWhereWithoutPengawasInput | StudentUpdateManyWithWhereWithoutPengawasInput[]
    deleteMany?: StudentScalarWhereInput | StudentScalarWhereInput[]
  }

  export type PengawasCreateNestedOneWithoutStudentsInput = {
    create?: XOR<PengawasCreateWithoutStudentsInput, PengawasUncheckedCreateWithoutStudentsInput>
    connectOrCreate?: PengawasCreateOrConnectWithoutStudentsInput
    connect?: PengawasWhereUniqueInput
  }

  export type FatherCreateNestedOneWithoutStudentInput = {
    create?: XOR<FatherCreateWithoutStudentInput, FatherUncheckedCreateWithoutStudentInput>
    connectOrCreate?: FatherCreateOrConnectWithoutStudentInput
    connect?: FatherWhereUniqueInput
  }

  export type MotherCreateNestedOneWithoutStudentInput = {
    create?: XOR<MotherCreateWithoutStudentInput, MotherUncheckedCreateWithoutStudentInput>
    connectOrCreate?: MotherCreateOrConnectWithoutStudentInput
    connect?: MotherWhereUniqueInput
  }

  export type GuardianCreateNestedOneWithoutStudentInput = {
    create?: XOR<GuardianCreateWithoutStudentInput, GuardianUncheckedCreateWithoutStudentInput>
    connectOrCreate?: GuardianCreateOrConnectWithoutStudentInput
    connect?: GuardianWhereUniqueInput
  }

  export type EducationCostCreateNestedManyWithoutStudentInput = {
    create?: XOR<EducationCostCreateWithoutStudentInput, EducationCostUncheckedCreateWithoutStudentInput> | EducationCostCreateWithoutStudentInput[] | EducationCostUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: EducationCostCreateOrConnectWithoutStudentInput | EducationCostCreateOrConnectWithoutStudentInput[]
    createMany?: EducationCostCreateManyStudentInputEnvelope
    connect?: EducationCostWhereUniqueInput | EducationCostWhereUniqueInput[]
  }

  export type DocumentCreateNestedManyWithoutStudentInput = {
    create?: XOR<DocumentCreateWithoutStudentInput, DocumentUncheckedCreateWithoutStudentInput> | DocumentCreateWithoutStudentInput[] | DocumentUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutStudentInput | DocumentCreateOrConnectWithoutStudentInput[]
    createMany?: DocumentCreateManyStudentInputEnvelope
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
  }

  export type FatherUncheckedCreateNestedOneWithoutStudentInput = {
    create?: XOR<FatherCreateWithoutStudentInput, FatherUncheckedCreateWithoutStudentInput>
    connectOrCreate?: FatherCreateOrConnectWithoutStudentInput
    connect?: FatherWhereUniqueInput
  }

  export type MotherUncheckedCreateNestedOneWithoutStudentInput = {
    create?: XOR<MotherCreateWithoutStudentInput, MotherUncheckedCreateWithoutStudentInput>
    connectOrCreate?: MotherCreateOrConnectWithoutStudentInput
    connect?: MotherWhereUniqueInput
  }

  export type GuardianUncheckedCreateNestedOneWithoutStudentInput = {
    create?: XOR<GuardianCreateWithoutStudentInput, GuardianUncheckedCreateWithoutStudentInput>
    connectOrCreate?: GuardianCreateOrConnectWithoutStudentInput
    connect?: GuardianWhereUniqueInput
  }

  export type EducationCostUncheckedCreateNestedManyWithoutStudentInput = {
    create?: XOR<EducationCostCreateWithoutStudentInput, EducationCostUncheckedCreateWithoutStudentInput> | EducationCostCreateWithoutStudentInput[] | EducationCostUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: EducationCostCreateOrConnectWithoutStudentInput | EducationCostCreateOrConnectWithoutStudentInput[]
    createMany?: EducationCostCreateManyStudentInputEnvelope
    connect?: EducationCostWhereUniqueInput | EducationCostWhereUniqueInput[]
  }

  export type DocumentUncheckedCreateNestedManyWithoutStudentInput = {
    create?: XOR<DocumentCreateWithoutStudentInput, DocumentUncheckedCreateWithoutStudentInput> | DocumentCreateWithoutStudentInput[] | DocumentUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutStudentInput | DocumentCreateOrConnectWithoutStudentInput[]
    createMany?: DocumentCreateManyStudentInputEnvelope
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type PengawasUpdateOneRequiredWithoutStudentsNestedInput = {
    create?: XOR<PengawasCreateWithoutStudentsInput, PengawasUncheckedCreateWithoutStudentsInput>
    connectOrCreate?: PengawasCreateOrConnectWithoutStudentsInput
    upsert?: PengawasUpsertWithoutStudentsInput
    connect?: PengawasWhereUniqueInput
    update?: XOR<XOR<PengawasUpdateToOneWithWhereWithoutStudentsInput, PengawasUpdateWithoutStudentsInput>, PengawasUncheckedUpdateWithoutStudentsInput>
  }

  export type FatherUpdateOneWithoutStudentNestedInput = {
    create?: XOR<FatherCreateWithoutStudentInput, FatherUncheckedCreateWithoutStudentInput>
    connectOrCreate?: FatherCreateOrConnectWithoutStudentInput
    upsert?: FatherUpsertWithoutStudentInput
    disconnect?: FatherWhereInput | boolean
    delete?: FatherWhereInput | boolean
    connect?: FatherWhereUniqueInput
    update?: XOR<XOR<FatherUpdateToOneWithWhereWithoutStudentInput, FatherUpdateWithoutStudentInput>, FatherUncheckedUpdateWithoutStudentInput>
  }

  export type MotherUpdateOneWithoutStudentNestedInput = {
    create?: XOR<MotherCreateWithoutStudentInput, MotherUncheckedCreateWithoutStudentInput>
    connectOrCreate?: MotherCreateOrConnectWithoutStudentInput
    upsert?: MotherUpsertWithoutStudentInput
    disconnect?: MotherWhereInput | boolean
    delete?: MotherWhereInput | boolean
    connect?: MotherWhereUniqueInput
    update?: XOR<XOR<MotherUpdateToOneWithWhereWithoutStudentInput, MotherUpdateWithoutStudentInput>, MotherUncheckedUpdateWithoutStudentInput>
  }

  export type GuardianUpdateOneWithoutStudentNestedInput = {
    create?: XOR<GuardianCreateWithoutStudentInput, GuardianUncheckedCreateWithoutStudentInput>
    connectOrCreate?: GuardianCreateOrConnectWithoutStudentInput
    upsert?: GuardianUpsertWithoutStudentInput
    disconnect?: GuardianWhereInput | boolean
    delete?: GuardianWhereInput | boolean
    connect?: GuardianWhereUniqueInput
    update?: XOR<XOR<GuardianUpdateToOneWithWhereWithoutStudentInput, GuardianUpdateWithoutStudentInput>, GuardianUncheckedUpdateWithoutStudentInput>
  }

  export type EducationCostUpdateManyWithoutStudentNestedInput = {
    create?: XOR<EducationCostCreateWithoutStudentInput, EducationCostUncheckedCreateWithoutStudentInput> | EducationCostCreateWithoutStudentInput[] | EducationCostUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: EducationCostCreateOrConnectWithoutStudentInput | EducationCostCreateOrConnectWithoutStudentInput[]
    upsert?: EducationCostUpsertWithWhereUniqueWithoutStudentInput | EducationCostUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: EducationCostCreateManyStudentInputEnvelope
    set?: EducationCostWhereUniqueInput | EducationCostWhereUniqueInput[]
    disconnect?: EducationCostWhereUniqueInput | EducationCostWhereUniqueInput[]
    delete?: EducationCostWhereUniqueInput | EducationCostWhereUniqueInput[]
    connect?: EducationCostWhereUniqueInput | EducationCostWhereUniqueInput[]
    update?: EducationCostUpdateWithWhereUniqueWithoutStudentInput | EducationCostUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: EducationCostUpdateManyWithWhereWithoutStudentInput | EducationCostUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: EducationCostScalarWhereInput | EducationCostScalarWhereInput[]
  }

  export type DocumentUpdateManyWithoutStudentNestedInput = {
    create?: XOR<DocumentCreateWithoutStudentInput, DocumentUncheckedCreateWithoutStudentInput> | DocumentCreateWithoutStudentInput[] | DocumentUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutStudentInput | DocumentCreateOrConnectWithoutStudentInput[]
    upsert?: DocumentUpsertWithWhereUniqueWithoutStudentInput | DocumentUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: DocumentCreateManyStudentInputEnvelope
    set?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    disconnect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    delete?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    update?: DocumentUpdateWithWhereUniqueWithoutStudentInput | DocumentUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: DocumentUpdateManyWithWhereWithoutStudentInput | DocumentUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
  }

  export type FatherUncheckedUpdateOneWithoutStudentNestedInput = {
    create?: XOR<FatherCreateWithoutStudentInput, FatherUncheckedCreateWithoutStudentInput>
    connectOrCreate?: FatherCreateOrConnectWithoutStudentInput
    upsert?: FatherUpsertWithoutStudentInput
    disconnect?: FatherWhereInput | boolean
    delete?: FatherWhereInput | boolean
    connect?: FatherWhereUniqueInput
    update?: XOR<XOR<FatherUpdateToOneWithWhereWithoutStudentInput, FatherUpdateWithoutStudentInput>, FatherUncheckedUpdateWithoutStudentInput>
  }

  export type MotherUncheckedUpdateOneWithoutStudentNestedInput = {
    create?: XOR<MotherCreateWithoutStudentInput, MotherUncheckedCreateWithoutStudentInput>
    connectOrCreate?: MotherCreateOrConnectWithoutStudentInput
    upsert?: MotherUpsertWithoutStudentInput
    disconnect?: MotherWhereInput | boolean
    delete?: MotherWhereInput | boolean
    connect?: MotherWhereUniqueInput
    update?: XOR<XOR<MotherUpdateToOneWithWhereWithoutStudentInput, MotherUpdateWithoutStudentInput>, MotherUncheckedUpdateWithoutStudentInput>
  }

  export type GuardianUncheckedUpdateOneWithoutStudentNestedInput = {
    create?: XOR<GuardianCreateWithoutStudentInput, GuardianUncheckedCreateWithoutStudentInput>
    connectOrCreate?: GuardianCreateOrConnectWithoutStudentInput
    upsert?: GuardianUpsertWithoutStudentInput
    disconnect?: GuardianWhereInput | boolean
    delete?: GuardianWhereInput | boolean
    connect?: GuardianWhereUniqueInput
    update?: XOR<XOR<GuardianUpdateToOneWithWhereWithoutStudentInput, GuardianUpdateWithoutStudentInput>, GuardianUncheckedUpdateWithoutStudentInput>
  }

  export type EducationCostUncheckedUpdateManyWithoutStudentNestedInput = {
    create?: XOR<EducationCostCreateWithoutStudentInput, EducationCostUncheckedCreateWithoutStudentInput> | EducationCostCreateWithoutStudentInput[] | EducationCostUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: EducationCostCreateOrConnectWithoutStudentInput | EducationCostCreateOrConnectWithoutStudentInput[]
    upsert?: EducationCostUpsertWithWhereUniqueWithoutStudentInput | EducationCostUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: EducationCostCreateManyStudentInputEnvelope
    set?: EducationCostWhereUniqueInput | EducationCostWhereUniqueInput[]
    disconnect?: EducationCostWhereUniqueInput | EducationCostWhereUniqueInput[]
    delete?: EducationCostWhereUniqueInput | EducationCostWhereUniqueInput[]
    connect?: EducationCostWhereUniqueInput | EducationCostWhereUniqueInput[]
    update?: EducationCostUpdateWithWhereUniqueWithoutStudentInput | EducationCostUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: EducationCostUpdateManyWithWhereWithoutStudentInput | EducationCostUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: EducationCostScalarWhereInput | EducationCostScalarWhereInput[]
  }

  export type DocumentUncheckedUpdateManyWithoutStudentNestedInput = {
    create?: XOR<DocumentCreateWithoutStudentInput, DocumentUncheckedCreateWithoutStudentInput> | DocumentCreateWithoutStudentInput[] | DocumentUncheckedCreateWithoutStudentInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutStudentInput | DocumentCreateOrConnectWithoutStudentInput[]
    upsert?: DocumentUpsertWithWhereUniqueWithoutStudentInput | DocumentUpsertWithWhereUniqueWithoutStudentInput[]
    createMany?: DocumentCreateManyStudentInputEnvelope
    set?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    disconnect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    delete?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    update?: DocumentUpdateWithWhereUniqueWithoutStudentInput | DocumentUpdateWithWhereUniqueWithoutStudentInput[]
    updateMany?: DocumentUpdateManyWithWhereWithoutStudentInput | DocumentUpdateManyWithWhereWithoutStudentInput[]
    deleteMany?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
  }

  export type StudentCreateNestedOneWithoutEducationCostsInput = {
    create?: XOR<StudentCreateWithoutEducationCostsInput, StudentUncheckedCreateWithoutEducationCostsInput>
    connectOrCreate?: StudentCreateOrConnectWithoutEducationCostsInput
    connect?: StudentWhereUniqueInput
  }

  export type StudentUpdateOneRequiredWithoutEducationCostsNestedInput = {
    create?: XOR<StudentCreateWithoutEducationCostsInput, StudentUncheckedCreateWithoutEducationCostsInput>
    connectOrCreate?: StudentCreateOrConnectWithoutEducationCostsInput
    upsert?: StudentUpsertWithoutEducationCostsInput
    connect?: StudentWhereUniqueInput
    update?: XOR<XOR<StudentUpdateToOneWithWhereWithoutEducationCostsInput, StudentUpdateWithoutEducationCostsInput>, StudentUncheckedUpdateWithoutEducationCostsInput>
  }

  export type StudentCreateNestedOneWithoutFatherInput = {
    create?: XOR<StudentCreateWithoutFatherInput, StudentUncheckedCreateWithoutFatherInput>
    connectOrCreate?: StudentCreateOrConnectWithoutFatherInput
    connect?: StudentWhereUniqueInput
  }

  export type StudentUpdateOneRequiredWithoutFatherNestedInput = {
    create?: XOR<StudentCreateWithoutFatherInput, StudentUncheckedCreateWithoutFatherInput>
    connectOrCreate?: StudentCreateOrConnectWithoutFatherInput
    upsert?: StudentUpsertWithoutFatherInput
    connect?: StudentWhereUniqueInput
    update?: XOR<XOR<StudentUpdateToOneWithWhereWithoutFatherInput, StudentUpdateWithoutFatherInput>, StudentUncheckedUpdateWithoutFatherInput>
  }

  export type StudentCreateNestedOneWithoutMotherInput = {
    create?: XOR<StudentCreateWithoutMotherInput, StudentUncheckedCreateWithoutMotherInput>
    connectOrCreate?: StudentCreateOrConnectWithoutMotherInput
    connect?: StudentWhereUniqueInput
  }

  export type StudentUpdateOneRequiredWithoutMotherNestedInput = {
    create?: XOR<StudentCreateWithoutMotherInput, StudentUncheckedCreateWithoutMotherInput>
    connectOrCreate?: StudentCreateOrConnectWithoutMotherInput
    upsert?: StudentUpsertWithoutMotherInput
    connect?: StudentWhereUniqueInput
    update?: XOR<XOR<StudentUpdateToOneWithWhereWithoutMotherInput, StudentUpdateWithoutMotherInput>, StudentUncheckedUpdateWithoutMotherInput>
  }

  export type StudentCreateNestedOneWithoutGuardianInput = {
    create?: XOR<StudentCreateWithoutGuardianInput, StudentUncheckedCreateWithoutGuardianInput>
    connectOrCreate?: StudentCreateOrConnectWithoutGuardianInput
    connect?: StudentWhereUniqueInput
  }

  export type StudentUpdateOneRequiredWithoutGuardianNestedInput = {
    create?: XOR<StudentCreateWithoutGuardianInput, StudentUncheckedCreateWithoutGuardianInput>
    connectOrCreate?: StudentCreateOrConnectWithoutGuardianInput
    upsert?: StudentUpsertWithoutGuardianInput
    connect?: StudentWhereUniqueInput
    update?: XOR<XOR<StudentUpdateToOneWithWhereWithoutGuardianInput, StudentUpdateWithoutGuardianInput>, StudentUncheckedUpdateWithoutGuardianInput>
  }

  export type StudentCreateNestedOneWithoutDocumentsInput = {
    create?: XOR<StudentCreateWithoutDocumentsInput, StudentUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: StudentCreateOrConnectWithoutDocumentsInput
    connect?: StudentWhereUniqueInput
  }

  export type StudentUpdateOneRequiredWithoutDocumentsNestedInput = {
    create?: XOR<StudentCreateWithoutDocumentsInput, StudentUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: StudentCreateOrConnectWithoutDocumentsInput
    upsert?: StudentUpsertWithoutDocumentsInput
    connect?: StudentWhereUniqueInput
    update?: XOR<XOR<StudentUpdateToOneWithWhereWithoutDocumentsInput, StudentUpdateWithoutDocumentsInput>, StudentUncheckedUpdateWithoutDocumentsInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StudentCreateWithoutPengawasInput = {
    username: string
    nik: string
    fullName: string
    dateOfBirth: Date | string
    gender: string
    citaCita: string
    wilayah: string
    alamatLengkap: string
    noHp: string
    riwayatPenyakit: string
    schoolName: string
    gradeLevel: string
    nilaiRataRata: string
    jumlahSaudara: number
    createdAt?: Date | string
    father?: FatherCreateNestedOneWithoutStudentInput
    mother?: MotherCreateNestedOneWithoutStudentInput
    guardian?: GuardianCreateNestedOneWithoutStudentInput
    educationCosts?: EducationCostCreateNestedManyWithoutStudentInput
    documents?: DocumentCreateNestedManyWithoutStudentInput
  }

  export type StudentUncheckedCreateWithoutPengawasInput = {
    id?: number
    username: string
    nik: string
    fullName: string
    dateOfBirth: Date | string
    gender: string
    citaCita: string
    wilayah: string
    alamatLengkap: string
    noHp: string
    riwayatPenyakit: string
    schoolName: string
    gradeLevel: string
    nilaiRataRata: string
    jumlahSaudara: number
    createdAt?: Date | string
    father?: FatherUncheckedCreateNestedOneWithoutStudentInput
    mother?: MotherUncheckedCreateNestedOneWithoutStudentInput
    guardian?: GuardianUncheckedCreateNestedOneWithoutStudentInput
    educationCosts?: EducationCostUncheckedCreateNestedManyWithoutStudentInput
    documents?: DocumentUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentCreateOrConnectWithoutPengawasInput = {
    where: StudentWhereUniqueInput
    create: XOR<StudentCreateWithoutPengawasInput, StudentUncheckedCreateWithoutPengawasInput>
  }

  export type StudentCreateManyPengawasInputEnvelope = {
    data: StudentCreateManyPengawasInput | StudentCreateManyPengawasInput[]
    skipDuplicates?: boolean
  }

  export type StudentUpsertWithWhereUniqueWithoutPengawasInput = {
    where: StudentWhereUniqueInput
    update: XOR<StudentUpdateWithoutPengawasInput, StudentUncheckedUpdateWithoutPengawasInput>
    create: XOR<StudentCreateWithoutPengawasInput, StudentUncheckedCreateWithoutPengawasInput>
  }

  export type StudentUpdateWithWhereUniqueWithoutPengawasInput = {
    where: StudentWhereUniqueInput
    data: XOR<StudentUpdateWithoutPengawasInput, StudentUncheckedUpdateWithoutPengawasInput>
  }

  export type StudentUpdateManyWithWhereWithoutPengawasInput = {
    where: StudentScalarWhereInput
    data: XOR<StudentUpdateManyMutationInput, StudentUncheckedUpdateManyWithoutPengawasInput>
  }

  export type StudentScalarWhereInput = {
    AND?: StudentScalarWhereInput | StudentScalarWhereInput[]
    OR?: StudentScalarWhereInput[]
    NOT?: StudentScalarWhereInput | StudentScalarWhereInput[]
    id?: IntFilter<"Student"> | number
    username?: StringFilter<"Student"> | string
    nik?: StringFilter<"Student"> | string
    fullName?: StringFilter<"Student"> | string
    dateOfBirth?: DateTimeFilter<"Student"> | Date | string
    gender?: StringFilter<"Student"> | string
    citaCita?: StringFilter<"Student"> | string
    wilayah?: StringFilter<"Student"> | string
    pengawasId?: IntFilter<"Student"> | number
    alamatLengkap?: StringFilter<"Student"> | string
    noHp?: StringFilter<"Student"> | string
    riwayatPenyakit?: StringFilter<"Student"> | string
    schoolName?: StringFilter<"Student"> | string
    gradeLevel?: StringFilter<"Student"> | string
    nilaiRataRata?: StringFilter<"Student"> | string
    jumlahSaudara?: IntFilter<"Student"> | number
    createdAt?: DateTimeFilter<"Student"> | Date | string
  }

  export type PengawasCreateWithoutStudentsInput = {
    username: string
    password: string
    name: string
    wilayah: string
  }

  export type PengawasUncheckedCreateWithoutStudentsInput = {
    id?: number
    username: string
    password: string
    name: string
    wilayah: string
  }

  export type PengawasCreateOrConnectWithoutStudentsInput = {
    where: PengawasWhereUniqueInput
    create: XOR<PengawasCreateWithoutStudentsInput, PengawasUncheckedCreateWithoutStudentsInput>
  }

  export type FatherCreateWithoutStudentInput = {
    name: string
    status: string
    occupation: string
    incomePerMonth: string
    address: string
    phone: string
    medicalHistory: string
  }

  export type FatherUncheckedCreateWithoutStudentInput = {
    id?: number
    name: string
    status: string
    occupation: string
    incomePerMonth: string
    address: string
    phone: string
    medicalHistory: string
  }

  export type FatherCreateOrConnectWithoutStudentInput = {
    where: FatherWhereUniqueInput
    create: XOR<FatherCreateWithoutStudentInput, FatherUncheckedCreateWithoutStudentInput>
  }

  export type MotherCreateWithoutStudentInput = {
    name: string
    status: string
    occupation: string
    incomePerMonth: string
    address: string
    phone: string
    medicalHistory: string
  }

  export type MotherUncheckedCreateWithoutStudentInput = {
    id?: number
    name: string
    status: string
    occupation: string
    incomePerMonth: string
    address: string
    phone: string
    medicalHistory: string
  }

  export type MotherCreateOrConnectWithoutStudentInput = {
    where: MotherWhereUniqueInput
    create: XOR<MotherCreateWithoutStudentInput, MotherUncheckedCreateWithoutStudentInput>
  }

  export type GuardianCreateWithoutStudentInput = {
    name: string
    status: string
    occupation: string
    incomePerMonth: string
    address: string
    phone: string
    medicalHistory: string
  }

  export type GuardianUncheckedCreateWithoutStudentInput = {
    id?: number
    name: string
    status: string
    occupation: string
    incomePerMonth: string
    address: string
    phone: string
    medicalHistory: string
  }

  export type GuardianCreateOrConnectWithoutStudentInput = {
    where: GuardianWhereUniqueInput
    create: XOR<GuardianCreateWithoutStudentInput, GuardianUncheckedCreateWithoutStudentInput>
  }

  export type EducationCostCreateWithoutStudentInput = {
    label: string
    amount: number
  }

  export type EducationCostUncheckedCreateWithoutStudentInput = {
    id?: number
    label: string
    amount: number
  }

  export type EducationCostCreateOrConnectWithoutStudentInput = {
    where: EducationCostWhereUniqueInput
    create: XOR<EducationCostCreateWithoutStudentInput, EducationCostUncheckedCreateWithoutStudentInput>
  }

  export type EducationCostCreateManyStudentInputEnvelope = {
    data: EducationCostCreateManyStudentInput | EducationCostCreateManyStudentInput[]
    skipDuplicates?: boolean
  }

  export type DocumentCreateWithoutStudentInput = {
    type: string
    fileUrl: string
    uploadedAt?: Date | string
  }

  export type DocumentUncheckedCreateWithoutStudentInput = {
    id?: number
    type: string
    fileUrl: string
    uploadedAt?: Date | string
  }

  export type DocumentCreateOrConnectWithoutStudentInput = {
    where: DocumentWhereUniqueInput
    create: XOR<DocumentCreateWithoutStudentInput, DocumentUncheckedCreateWithoutStudentInput>
  }

  export type DocumentCreateManyStudentInputEnvelope = {
    data: DocumentCreateManyStudentInput | DocumentCreateManyStudentInput[]
    skipDuplicates?: boolean
  }

  export type PengawasUpsertWithoutStudentsInput = {
    update: XOR<PengawasUpdateWithoutStudentsInput, PengawasUncheckedUpdateWithoutStudentsInput>
    create: XOR<PengawasCreateWithoutStudentsInput, PengawasUncheckedCreateWithoutStudentsInput>
    where?: PengawasWhereInput
  }

  export type PengawasUpdateToOneWithWhereWithoutStudentsInput = {
    where?: PengawasWhereInput
    data: XOR<PengawasUpdateWithoutStudentsInput, PengawasUncheckedUpdateWithoutStudentsInput>
  }

  export type PengawasUpdateWithoutStudentsInput = {
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    wilayah?: StringFieldUpdateOperationsInput | string
  }

  export type PengawasUncheckedUpdateWithoutStudentsInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    wilayah?: StringFieldUpdateOperationsInput | string
  }

  export type FatherUpsertWithoutStudentInput = {
    update: XOR<FatherUpdateWithoutStudentInput, FatherUncheckedUpdateWithoutStudentInput>
    create: XOR<FatherCreateWithoutStudentInput, FatherUncheckedCreateWithoutStudentInput>
    where?: FatherWhereInput
  }

  export type FatherUpdateToOneWithWhereWithoutStudentInput = {
    where?: FatherWhereInput
    data: XOR<FatherUpdateWithoutStudentInput, FatherUncheckedUpdateWithoutStudentInput>
  }

  export type FatherUpdateWithoutStudentInput = {
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    occupation?: StringFieldUpdateOperationsInput | string
    incomePerMonth?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    medicalHistory?: StringFieldUpdateOperationsInput | string
  }

  export type FatherUncheckedUpdateWithoutStudentInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    occupation?: StringFieldUpdateOperationsInput | string
    incomePerMonth?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    medicalHistory?: StringFieldUpdateOperationsInput | string
  }

  export type MotherUpsertWithoutStudentInput = {
    update: XOR<MotherUpdateWithoutStudentInput, MotherUncheckedUpdateWithoutStudentInput>
    create: XOR<MotherCreateWithoutStudentInput, MotherUncheckedCreateWithoutStudentInput>
    where?: MotherWhereInput
  }

  export type MotherUpdateToOneWithWhereWithoutStudentInput = {
    where?: MotherWhereInput
    data: XOR<MotherUpdateWithoutStudentInput, MotherUncheckedUpdateWithoutStudentInput>
  }

  export type MotherUpdateWithoutStudentInput = {
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    occupation?: StringFieldUpdateOperationsInput | string
    incomePerMonth?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    medicalHistory?: StringFieldUpdateOperationsInput | string
  }

  export type MotherUncheckedUpdateWithoutStudentInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    occupation?: StringFieldUpdateOperationsInput | string
    incomePerMonth?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    medicalHistory?: StringFieldUpdateOperationsInput | string
  }

  export type GuardianUpsertWithoutStudentInput = {
    update: XOR<GuardianUpdateWithoutStudentInput, GuardianUncheckedUpdateWithoutStudentInput>
    create: XOR<GuardianCreateWithoutStudentInput, GuardianUncheckedCreateWithoutStudentInput>
    where?: GuardianWhereInput
  }

  export type GuardianUpdateToOneWithWhereWithoutStudentInput = {
    where?: GuardianWhereInput
    data: XOR<GuardianUpdateWithoutStudentInput, GuardianUncheckedUpdateWithoutStudentInput>
  }

  export type GuardianUpdateWithoutStudentInput = {
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    occupation?: StringFieldUpdateOperationsInput | string
    incomePerMonth?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    medicalHistory?: StringFieldUpdateOperationsInput | string
  }

  export type GuardianUncheckedUpdateWithoutStudentInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    occupation?: StringFieldUpdateOperationsInput | string
    incomePerMonth?: StringFieldUpdateOperationsInput | string
    address?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    medicalHistory?: StringFieldUpdateOperationsInput | string
  }

  export type EducationCostUpsertWithWhereUniqueWithoutStudentInput = {
    where: EducationCostWhereUniqueInput
    update: XOR<EducationCostUpdateWithoutStudentInput, EducationCostUncheckedUpdateWithoutStudentInput>
    create: XOR<EducationCostCreateWithoutStudentInput, EducationCostUncheckedCreateWithoutStudentInput>
  }

  export type EducationCostUpdateWithWhereUniqueWithoutStudentInput = {
    where: EducationCostWhereUniqueInput
    data: XOR<EducationCostUpdateWithoutStudentInput, EducationCostUncheckedUpdateWithoutStudentInput>
  }

  export type EducationCostUpdateManyWithWhereWithoutStudentInput = {
    where: EducationCostScalarWhereInput
    data: XOR<EducationCostUpdateManyMutationInput, EducationCostUncheckedUpdateManyWithoutStudentInput>
  }

  export type EducationCostScalarWhereInput = {
    AND?: EducationCostScalarWhereInput | EducationCostScalarWhereInput[]
    OR?: EducationCostScalarWhereInput[]
    NOT?: EducationCostScalarWhereInput | EducationCostScalarWhereInput[]
    id?: IntFilter<"EducationCost"> | number
    studentId?: IntFilter<"EducationCost"> | number
    label?: StringFilter<"EducationCost"> | string
    amount?: IntFilter<"EducationCost"> | number
  }

  export type DocumentUpsertWithWhereUniqueWithoutStudentInput = {
    where: DocumentWhereUniqueInput
    update: XOR<DocumentUpdateWithoutStudentInput, DocumentUncheckedUpdateWithoutStudentInput>
    create: XOR<DocumentCreateWithoutStudentInput, DocumentUncheckedCreateWithoutStudentInput>
  }

  export type DocumentUpdateWithWhereUniqueWithoutStudentInput = {
    where: DocumentWhereUniqueInput
    data: XOR<DocumentUpdateWithoutStudentInput, DocumentUncheckedUpdateWithoutStudentInput>
  }

  export type DocumentUpdateManyWithWhereWithoutStudentInput = {
    where: DocumentScalarWhereInput
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyWithoutStudentInput>
  }

  export type DocumentScalarWhereInput = {
    AND?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
    OR?: DocumentScalarWhereInput[]
    NOT?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
    id?: IntFilter<"Document"> | number
    studentId?: IntFilter<"Document"> | number
    type?: StringFilter<"Document"> | string
    fileUrl?: StringFilter<"Document"> | string
    uploadedAt?: DateTimeFilter<"Document"> | Date | string
  }

  export type StudentCreateWithoutEducationCostsInput = {
    username: string
    nik: string
    fullName: string
    dateOfBirth: Date | string
    gender: string
    citaCita: string
    wilayah: string
    alamatLengkap: string
    noHp: string
    riwayatPenyakit: string
    schoolName: string
    gradeLevel: string
    nilaiRataRata: string
    jumlahSaudara: number
    createdAt?: Date | string
    pengawas: PengawasCreateNestedOneWithoutStudentsInput
    father?: FatherCreateNestedOneWithoutStudentInput
    mother?: MotherCreateNestedOneWithoutStudentInput
    guardian?: GuardianCreateNestedOneWithoutStudentInput
    documents?: DocumentCreateNestedManyWithoutStudentInput
  }

  export type StudentUncheckedCreateWithoutEducationCostsInput = {
    id?: number
    username: string
    nik: string
    fullName: string
    dateOfBirth: Date | string
    gender: string
    citaCita: string
    wilayah: string
    pengawasId: number
    alamatLengkap: string
    noHp: string
    riwayatPenyakit: string
    schoolName: string
    gradeLevel: string
    nilaiRataRata: string
    jumlahSaudara: number
    createdAt?: Date | string
    father?: FatherUncheckedCreateNestedOneWithoutStudentInput
    mother?: MotherUncheckedCreateNestedOneWithoutStudentInput
    guardian?: GuardianUncheckedCreateNestedOneWithoutStudentInput
    documents?: DocumentUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentCreateOrConnectWithoutEducationCostsInput = {
    where: StudentWhereUniqueInput
    create: XOR<StudentCreateWithoutEducationCostsInput, StudentUncheckedCreateWithoutEducationCostsInput>
  }

  export type StudentUpsertWithoutEducationCostsInput = {
    update: XOR<StudentUpdateWithoutEducationCostsInput, StudentUncheckedUpdateWithoutEducationCostsInput>
    create: XOR<StudentCreateWithoutEducationCostsInput, StudentUncheckedCreateWithoutEducationCostsInput>
    where?: StudentWhereInput
  }

  export type StudentUpdateToOneWithWhereWithoutEducationCostsInput = {
    where?: StudentWhereInput
    data: XOR<StudentUpdateWithoutEducationCostsInput, StudentUncheckedUpdateWithoutEducationCostsInput>
  }

  export type StudentUpdateWithoutEducationCostsInput = {
    username?: StringFieldUpdateOperationsInput | string
    nik?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    citaCita?: StringFieldUpdateOperationsInput | string
    wilayah?: StringFieldUpdateOperationsInput | string
    alamatLengkap?: StringFieldUpdateOperationsInput | string
    noHp?: StringFieldUpdateOperationsInput | string
    riwayatPenyakit?: StringFieldUpdateOperationsInput | string
    schoolName?: StringFieldUpdateOperationsInput | string
    gradeLevel?: StringFieldUpdateOperationsInput | string
    nilaiRataRata?: StringFieldUpdateOperationsInput | string
    jumlahSaudara?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pengawas?: PengawasUpdateOneRequiredWithoutStudentsNestedInput
    father?: FatherUpdateOneWithoutStudentNestedInput
    mother?: MotherUpdateOneWithoutStudentNestedInput
    guardian?: GuardianUpdateOneWithoutStudentNestedInput
    documents?: DocumentUpdateManyWithoutStudentNestedInput
  }

  export type StudentUncheckedUpdateWithoutEducationCostsInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    nik?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    citaCita?: StringFieldUpdateOperationsInput | string
    wilayah?: StringFieldUpdateOperationsInput | string
    pengawasId?: IntFieldUpdateOperationsInput | number
    alamatLengkap?: StringFieldUpdateOperationsInput | string
    noHp?: StringFieldUpdateOperationsInput | string
    riwayatPenyakit?: StringFieldUpdateOperationsInput | string
    schoolName?: StringFieldUpdateOperationsInput | string
    gradeLevel?: StringFieldUpdateOperationsInput | string
    nilaiRataRata?: StringFieldUpdateOperationsInput | string
    jumlahSaudara?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    father?: FatherUncheckedUpdateOneWithoutStudentNestedInput
    mother?: MotherUncheckedUpdateOneWithoutStudentNestedInput
    guardian?: GuardianUncheckedUpdateOneWithoutStudentNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type StudentCreateWithoutFatherInput = {
    username: string
    nik: string
    fullName: string
    dateOfBirth: Date | string
    gender: string
    citaCita: string
    wilayah: string
    alamatLengkap: string
    noHp: string
    riwayatPenyakit: string
    schoolName: string
    gradeLevel: string
    nilaiRataRata: string
    jumlahSaudara: number
    createdAt?: Date | string
    pengawas: PengawasCreateNestedOneWithoutStudentsInput
    mother?: MotherCreateNestedOneWithoutStudentInput
    guardian?: GuardianCreateNestedOneWithoutStudentInput
    educationCosts?: EducationCostCreateNestedManyWithoutStudentInput
    documents?: DocumentCreateNestedManyWithoutStudentInput
  }

  export type StudentUncheckedCreateWithoutFatherInput = {
    id?: number
    username: string
    nik: string
    fullName: string
    dateOfBirth: Date | string
    gender: string
    citaCita: string
    wilayah: string
    pengawasId: number
    alamatLengkap: string
    noHp: string
    riwayatPenyakit: string
    schoolName: string
    gradeLevel: string
    nilaiRataRata: string
    jumlahSaudara: number
    createdAt?: Date | string
    mother?: MotherUncheckedCreateNestedOneWithoutStudentInput
    guardian?: GuardianUncheckedCreateNestedOneWithoutStudentInput
    educationCosts?: EducationCostUncheckedCreateNestedManyWithoutStudentInput
    documents?: DocumentUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentCreateOrConnectWithoutFatherInput = {
    where: StudentWhereUniqueInput
    create: XOR<StudentCreateWithoutFatherInput, StudentUncheckedCreateWithoutFatherInput>
  }

  export type StudentUpsertWithoutFatherInput = {
    update: XOR<StudentUpdateWithoutFatherInput, StudentUncheckedUpdateWithoutFatherInput>
    create: XOR<StudentCreateWithoutFatherInput, StudentUncheckedCreateWithoutFatherInput>
    where?: StudentWhereInput
  }

  export type StudentUpdateToOneWithWhereWithoutFatherInput = {
    where?: StudentWhereInput
    data: XOR<StudentUpdateWithoutFatherInput, StudentUncheckedUpdateWithoutFatherInput>
  }

  export type StudentUpdateWithoutFatherInput = {
    username?: StringFieldUpdateOperationsInput | string
    nik?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    citaCita?: StringFieldUpdateOperationsInput | string
    wilayah?: StringFieldUpdateOperationsInput | string
    alamatLengkap?: StringFieldUpdateOperationsInput | string
    noHp?: StringFieldUpdateOperationsInput | string
    riwayatPenyakit?: StringFieldUpdateOperationsInput | string
    schoolName?: StringFieldUpdateOperationsInput | string
    gradeLevel?: StringFieldUpdateOperationsInput | string
    nilaiRataRata?: StringFieldUpdateOperationsInput | string
    jumlahSaudara?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pengawas?: PengawasUpdateOneRequiredWithoutStudentsNestedInput
    mother?: MotherUpdateOneWithoutStudentNestedInput
    guardian?: GuardianUpdateOneWithoutStudentNestedInput
    educationCosts?: EducationCostUpdateManyWithoutStudentNestedInput
    documents?: DocumentUpdateManyWithoutStudentNestedInput
  }

  export type StudentUncheckedUpdateWithoutFatherInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    nik?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    citaCita?: StringFieldUpdateOperationsInput | string
    wilayah?: StringFieldUpdateOperationsInput | string
    pengawasId?: IntFieldUpdateOperationsInput | number
    alamatLengkap?: StringFieldUpdateOperationsInput | string
    noHp?: StringFieldUpdateOperationsInput | string
    riwayatPenyakit?: StringFieldUpdateOperationsInput | string
    schoolName?: StringFieldUpdateOperationsInput | string
    gradeLevel?: StringFieldUpdateOperationsInput | string
    nilaiRataRata?: StringFieldUpdateOperationsInput | string
    jumlahSaudara?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    mother?: MotherUncheckedUpdateOneWithoutStudentNestedInput
    guardian?: GuardianUncheckedUpdateOneWithoutStudentNestedInput
    educationCosts?: EducationCostUncheckedUpdateManyWithoutStudentNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type StudentCreateWithoutMotherInput = {
    username: string
    nik: string
    fullName: string
    dateOfBirth: Date | string
    gender: string
    citaCita: string
    wilayah: string
    alamatLengkap: string
    noHp: string
    riwayatPenyakit: string
    schoolName: string
    gradeLevel: string
    nilaiRataRata: string
    jumlahSaudara: number
    createdAt?: Date | string
    pengawas: PengawasCreateNestedOneWithoutStudentsInput
    father?: FatherCreateNestedOneWithoutStudentInput
    guardian?: GuardianCreateNestedOneWithoutStudentInput
    educationCosts?: EducationCostCreateNestedManyWithoutStudentInput
    documents?: DocumentCreateNestedManyWithoutStudentInput
  }

  export type StudentUncheckedCreateWithoutMotherInput = {
    id?: number
    username: string
    nik: string
    fullName: string
    dateOfBirth: Date | string
    gender: string
    citaCita: string
    wilayah: string
    pengawasId: number
    alamatLengkap: string
    noHp: string
    riwayatPenyakit: string
    schoolName: string
    gradeLevel: string
    nilaiRataRata: string
    jumlahSaudara: number
    createdAt?: Date | string
    father?: FatherUncheckedCreateNestedOneWithoutStudentInput
    guardian?: GuardianUncheckedCreateNestedOneWithoutStudentInput
    educationCosts?: EducationCostUncheckedCreateNestedManyWithoutStudentInput
    documents?: DocumentUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentCreateOrConnectWithoutMotherInput = {
    where: StudentWhereUniqueInput
    create: XOR<StudentCreateWithoutMotherInput, StudentUncheckedCreateWithoutMotherInput>
  }

  export type StudentUpsertWithoutMotherInput = {
    update: XOR<StudentUpdateWithoutMotherInput, StudentUncheckedUpdateWithoutMotherInput>
    create: XOR<StudentCreateWithoutMotherInput, StudentUncheckedCreateWithoutMotherInput>
    where?: StudentWhereInput
  }

  export type StudentUpdateToOneWithWhereWithoutMotherInput = {
    where?: StudentWhereInput
    data: XOR<StudentUpdateWithoutMotherInput, StudentUncheckedUpdateWithoutMotherInput>
  }

  export type StudentUpdateWithoutMotherInput = {
    username?: StringFieldUpdateOperationsInput | string
    nik?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    citaCita?: StringFieldUpdateOperationsInput | string
    wilayah?: StringFieldUpdateOperationsInput | string
    alamatLengkap?: StringFieldUpdateOperationsInput | string
    noHp?: StringFieldUpdateOperationsInput | string
    riwayatPenyakit?: StringFieldUpdateOperationsInput | string
    schoolName?: StringFieldUpdateOperationsInput | string
    gradeLevel?: StringFieldUpdateOperationsInput | string
    nilaiRataRata?: StringFieldUpdateOperationsInput | string
    jumlahSaudara?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pengawas?: PengawasUpdateOneRequiredWithoutStudentsNestedInput
    father?: FatherUpdateOneWithoutStudentNestedInput
    guardian?: GuardianUpdateOneWithoutStudentNestedInput
    educationCosts?: EducationCostUpdateManyWithoutStudentNestedInput
    documents?: DocumentUpdateManyWithoutStudentNestedInput
  }

  export type StudentUncheckedUpdateWithoutMotherInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    nik?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    citaCita?: StringFieldUpdateOperationsInput | string
    wilayah?: StringFieldUpdateOperationsInput | string
    pengawasId?: IntFieldUpdateOperationsInput | number
    alamatLengkap?: StringFieldUpdateOperationsInput | string
    noHp?: StringFieldUpdateOperationsInput | string
    riwayatPenyakit?: StringFieldUpdateOperationsInput | string
    schoolName?: StringFieldUpdateOperationsInput | string
    gradeLevel?: StringFieldUpdateOperationsInput | string
    nilaiRataRata?: StringFieldUpdateOperationsInput | string
    jumlahSaudara?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    father?: FatherUncheckedUpdateOneWithoutStudentNestedInput
    guardian?: GuardianUncheckedUpdateOneWithoutStudentNestedInput
    educationCosts?: EducationCostUncheckedUpdateManyWithoutStudentNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type StudentCreateWithoutGuardianInput = {
    username: string
    nik: string
    fullName: string
    dateOfBirth: Date | string
    gender: string
    citaCita: string
    wilayah: string
    alamatLengkap: string
    noHp: string
    riwayatPenyakit: string
    schoolName: string
    gradeLevel: string
    nilaiRataRata: string
    jumlahSaudara: number
    createdAt?: Date | string
    pengawas: PengawasCreateNestedOneWithoutStudentsInput
    father?: FatherCreateNestedOneWithoutStudentInput
    mother?: MotherCreateNestedOneWithoutStudentInput
    educationCosts?: EducationCostCreateNestedManyWithoutStudentInput
    documents?: DocumentCreateNestedManyWithoutStudentInput
  }

  export type StudentUncheckedCreateWithoutGuardianInput = {
    id?: number
    username: string
    nik: string
    fullName: string
    dateOfBirth: Date | string
    gender: string
    citaCita: string
    wilayah: string
    pengawasId: number
    alamatLengkap: string
    noHp: string
    riwayatPenyakit: string
    schoolName: string
    gradeLevel: string
    nilaiRataRata: string
    jumlahSaudara: number
    createdAt?: Date | string
    father?: FatherUncheckedCreateNestedOneWithoutStudentInput
    mother?: MotherUncheckedCreateNestedOneWithoutStudentInput
    educationCosts?: EducationCostUncheckedCreateNestedManyWithoutStudentInput
    documents?: DocumentUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentCreateOrConnectWithoutGuardianInput = {
    where: StudentWhereUniqueInput
    create: XOR<StudentCreateWithoutGuardianInput, StudentUncheckedCreateWithoutGuardianInput>
  }

  export type StudentUpsertWithoutGuardianInput = {
    update: XOR<StudentUpdateWithoutGuardianInput, StudentUncheckedUpdateWithoutGuardianInput>
    create: XOR<StudentCreateWithoutGuardianInput, StudentUncheckedCreateWithoutGuardianInput>
    where?: StudentWhereInput
  }

  export type StudentUpdateToOneWithWhereWithoutGuardianInput = {
    where?: StudentWhereInput
    data: XOR<StudentUpdateWithoutGuardianInput, StudentUncheckedUpdateWithoutGuardianInput>
  }

  export type StudentUpdateWithoutGuardianInput = {
    username?: StringFieldUpdateOperationsInput | string
    nik?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    citaCita?: StringFieldUpdateOperationsInput | string
    wilayah?: StringFieldUpdateOperationsInput | string
    alamatLengkap?: StringFieldUpdateOperationsInput | string
    noHp?: StringFieldUpdateOperationsInput | string
    riwayatPenyakit?: StringFieldUpdateOperationsInput | string
    schoolName?: StringFieldUpdateOperationsInput | string
    gradeLevel?: StringFieldUpdateOperationsInput | string
    nilaiRataRata?: StringFieldUpdateOperationsInput | string
    jumlahSaudara?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pengawas?: PengawasUpdateOneRequiredWithoutStudentsNestedInput
    father?: FatherUpdateOneWithoutStudentNestedInput
    mother?: MotherUpdateOneWithoutStudentNestedInput
    educationCosts?: EducationCostUpdateManyWithoutStudentNestedInput
    documents?: DocumentUpdateManyWithoutStudentNestedInput
  }

  export type StudentUncheckedUpdateWithoutGuardianInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    nik?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    citaCita?: StringFieldUpdateOperationsInput | string
    wilayah?: StringFieldUpdateOperationsInput | string
    pengawasId?: IntFieldUpdateOperationsInput | number
    alamatLengkap?: StringFieldUpdateOperationsInput | string
    noHp?: StringFieldUpdateOperationsInput | string
    riwayatPenyakit?: StringFieldUpdateOperationsInput | string
    schoolName?: StringFieldUpdateOperationsInput | string
    gradeLevel?: StringFieldUpdateOperationsInput | string
    nilaiRataRata?: StringFieldUpdateOperationsInput | string
    jumlahSaudara?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    father?: FatherUncheckedUpdateOneWithoutStudentNestedInput
    mother?: MotherUncheckedUpdateOneWithoutStudentNestedInput
    educationCosts?: EducationCostUncheckedUpdateManyWithoutStudentNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type StudentCreateWithoutDocumentsInput = {
    username: string
    nik: string
    fullName: string
    dateOfBirth: Date | string
    gender: string
    citaCita: string
    wilayah: string
    alamatLengkap: string
    noHp: string
    riwayatPenyakit: string
    schoolName: string
    gradeLevel: string
    nilaiRataRata: string
    jumlahSaudara: number
    createdAt?: Date | string
    pengawas: PengawasCreateNestedOneWithoutStudentsInput
    father?: FatherCreateNestedOneWithoutStudentInput
    mother?: MotherCreateNestedOneWithoutStudentInput
    guardian?: GuardianCreateNestedOneWithoutStudentInput
    educationCosts?: EducationCostCreateNestedManyWithoutStudentInput
  }

  export type StudentUncheckedCreateWithoutDocumentsInput = {
    id?: number
    username: string
    nik: string
    fullName: string
    dateOfBirth: Date | string
    gender: string
    citaCita: string
    wilayah: string
    pengawasId: number
    alamatLengkap: string
    noHp: string
    riwayatPenyakit: string
    schoolName: string
    gradeLevel: string
    nilaiRataRata: string
    jumlahSaudara: number
    createdAt?: Date | string
    father?: FatherUncheckedCreateNestedOneWithoutStudentInput
    mother?: MotherUncheckedCreateNestedOneWithoutStudentInput
    guardian?: GuardianUncheckedCreateNestedOneWithoutStudentInput
    educationCosts?: EducationCostUncheckedCreateNestedManyWithoutStudentInput
  }

  export type StudentCreateOrConnectWithoutDocumentsInput = {
    where: StudentWhereUniqueInput
    create: XOR<StudentCreateWithoutDocumentsInput, StudentUncheckedCreateWithoutDocumentsInput>
  }

  export type StudentUpsertWithoutDocumentsInput = {
    update: XOR<StudentUpdateWithoutDocumentsInput, StudentUncheckedUpdateWithoutDocumentsInput>
    create: XOR<StudentCreateWithoutDocumentsInput, StudentUncheckedCreateWithoutDocumentsInput>
    where?: StudentWhereInput
  }

  export type StudentUpdateToOneWithWhereWithoutDocumentsInput = {
    where?: StudentWhereInput
    data: XOR<StudentUpdateWithoutDocumentsInput, StudentUncheckedUpdateWithoutDocumentsInput>
  }

  export type StudentUpdateWithoutDocumentsInput = {
    username?: StringFieldUpdateOperationsInput | string
    nik?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    citaCita?: StringFieldUpdateOperationsInput | string
    wilayah?: StringFieldUpdateOperationsInput | string
    alamatLengkap?: StringFieldUpdateOperationsInput | string
    noHp?: StringFieldUpdateOperationsInput | string
    riwayatPenyakit?: StringFieldUpdateOperationsInput | string
    schoolName?: StringFieldUpdateOperationsInput | string
    gradeLevel?: StringFieldUpdateOperationsInput | string
    nilaiRataRata?: StringFieldUpdateOperationsInput | string
    jumlahSaudara?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    pengawas?: PengawasUpdateOneRequiredWithoutStudentsNestedInput
    father?: FatherUpdateOneWithoutStudentNestedInput
    mother?: MotherUpdateOneWithoutStudentNestedInput
    guardian?: GuardianUpdateOneWithoutStudentNestedInput
    educationCosts?: EducationCostUpdateManyWithoutStudentNestedInput
  }

  export type StudentUncheckedUpdateWithoutDocumentsInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    nik?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    citaCita?: StringFieldUpdateOperationsInput | string
    wilayah?: StringFieldUpdateOperationsInput | string
    pengawasId?: IntFieldUpdateOperationsInput | number
    alamatLengkap?: StringFieldUpdateOperationsInput | string
    noHp?: StringFieldUpdateOperationsInput | string
    riwayatPenyakit?: StringFieldUpdateOperationsInput | string
    schoolName?: StringFieldUpdateOperationsInput | string
    gradeLevel?: StringFieldUpdateOperationsInput | string
    nilaiRataRata?: StringFieldUpdateOperationsInput | string
    jumlahSaudara?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    father?: FatherUncheckedUpdateOneWithoutStudentNestedInput
    mother?: MotherUncheckedUpdateOneWithoutStudentNestedInput
    guardian?: GuardianUncheckedUpdateOneWithoutStudentNestedInput
    educationCosts?: EducationCostUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type StudentCreateManyPengawasInput = {
    id?: number
    username: string
    nik: string
    fullName: string
    dateOfBirth: Date | string
    gender: string
    citaCita: string
    wilayah: string
    alamatLengkap: string
    noHp: string
    riwayatPenyakit: string
    schoolName: string
    gradeLevel: string
    nilaiRataRata: string
    jumlahSaudara: number
    createdAt?: Date | string
  }

  export type StudentUpdateWithoutPengawasInput = {
    username?: StringFieldUpdateOperationsInput | string
    nik?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    citaCita?: StringFieldUpdateOperationsInput | string
    wilayah?: StringFieldUpdateOperationsInput | string
    alamatLengkap?: StringFieldUpdateOperationsInput | string
    noHp?: StringFieldUpdateOperationsInput | string
    riwayatPenyakit?: StringFieldUpdateOperationsInput | string
    schoolName?: StringFieldUpdateOperationsInput | string
    gradeLevel?: StringFieldUpdateOperationsInput | string
    nilaiRataRata?: StringFieldUpdateOperationsInput | string
    jumlahSaudara?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    father?: FatherUpdateOneWithoutStudentNestedInput
    mother?: MotherUpdateOneWithoutStudentNestedInput
    guardian?: GuardianUpdateOneWithoutStudentNestedInput
    educationCosts?: EducationCostUpdateManyWithoutStudentNestedInput
    documents?: DocumentUpdateManyWithoutStudentNestedInput
  }

  export type StudentUncheckedUpdateWithoutPengawasInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    nik?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    citaCita?: StringFieldUpdateOperationsInput | string
    wilayah?: StringFieldUpdateOperationsInput | string
    alamatLengkap?: StringFieldUpdateOperationsInput | string
    noHp?: StringFieldUpdateOperationsInput | string
    riwayatPenyakit?: StringFieldUpdateOperationsInput | string
    schoolName?: StringFieldUpdateOperationsInput | string
    gradeLevel?: StringFieldUpdateOperationsInput | string
    nilaiRataRata?: StringFieldUpdateOperationsInput | string
    jumlahSaudara?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    father?: FatherUncheckedUpdateOneWithoutStudentNestedInput
    mother?: MotherUncheckedUpdateOneWithoutStudentNestedInput
    guardian?: GuardianUncheckedUpdateOneWithoutStudentNestedInput
    educationCosts?: EducationCostUncheckedUpdateManyWithoutStudentNestedInput
    documents?: DocumentUncheckedUpdateManyWithoutStudentNestedInput
  }

  export type StudentUncheckedUpdateManyWithoutPengawasInput = {
    id?: IntFieldUpdateOperationsInput | number
    username?: StringFieldUpdateOperationsInput | string
    nik?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    gender?: StringFieldUpdateOperationsInput | string
    citaCita?: StringFieldUpdateOperationsInput | string
    wilayah?: StringFieldUpdateOperationsInput | string
    alamatLengkap?: StringFieldUpdateOperationsInput | string
    noHp?: StringFieldUpdateOperationsInput | string
    riwayatPenyakit?: StringFieldUpdateOperationsInput | string
    schoolName?: StringFieldUpdateOperationsInput | string
    gradeLevel?: StringFieldUpdateOperationsInput | string
    nilaiRataRata?: StringFieldUpdateOperationsInput | string
    jumlahSaudara?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type EducationCostCreateManyStudentInput = {
    id?: number
    label: string
    amount: number
  }

  export type DocumentCreateManyStudentInput = {
    id?: number
    type: string
    fileUrl: string
    uploadedAt?: Date | string
  }

  export type EducationCostUpdateWithoutStudentInput = {
    label?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
  }

  export type EducationCostUncheckedUpdateWithoutStudentInput = {
    id?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
  }

  export type EducationCostUncheckedUpdateManyWithoutStudentInput = {
    id?: IntFieldUpdateOperationsInput | number
    label?: StringFieldUpdateOperationsInput | string
    amount?: IntFieldUpdateOperationsInput | number
  }

  export type DocumentUpdateWithoutStudentInput = {
    type?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUncheckedUpdateWithoutStudentInput = {
    id?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUncheckedUpdateManyWithoutStudentInput = {
    id?: IntFieldUpdateOperationsInput | number
    type?: StringFieldUpdateOperationsInput | string
    fileUrl?: StringFieldUpdateOperationsInput | string
    uploadedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}