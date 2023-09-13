import { PaperClipIcon } from '@heroicons/react/20/solid'
import { s } from 'hastscript'
import { useState } from 'preact/hooks'
import { useEffect } from 'react'
export interface Root {
  openapi: string
  info: Info
  servers: Server[]
  tags: string[]
  components: Components
  paths: Paths
}

export interface Info {
  title: string
  description: string
  termsOfService: string
  contact: Contact
  license: License
  version: string
}

export interface Contact {
  email: string
}

export interface License {
  url: string
  name: string
}

export interface Server {
  url: string
}

export interface Components {
  schemas: Schemas
  requestBodies: RequestBodies
  securitySchemes: SecuritySchemes
}

export interface Schemas {}

export interface RequestBodies {}

export interface SecuritySchemes {
  oauth: Oauth
}

export interface Oauth {
  type: string
  flows: Flows
}

export interface Flows {
  authorizationCode: AuthorizationCode
  clientCredentials: ClientCredentials
  implicit: Implicit
  password: Password
}

export interface AuthorizationCode {
  authorizationUrl: string
  scopes: Scopes
  tokenUrl: string
}

export interface Scopes {
  'https://auth.home.juxt.site/scopes/system/read': string
  'https://auth.home.juxt.site/scopes/system/self-identification': string
  'https://auth.home.juxt.site/scopes/system/write': string
}

export interface ClientCredentials {
  scopes: Scopes2
  tokenUrl: string
}

export interface Scopes2 {
  'https://auth.home.juxt.site/scopes/system/read': string
  'https://auth.home.juxt.site/scopes/system/self-identification': string
  'https://auth.home.juxt.site/scopes/system/write': string
}

export interface Implicit {
  authorizationUrl: string
  scopes: Scopes3
}

export interface Scopes3 {
  'https://auth.home.juxt.site/scopes/system/read': string
  'https://auth.home.juxt.site/scopes/system/self-identification': string
  'https://auth.home.juxt.site/scopes/system/write': string
}

export interface Password {
  scopes: Scopes4
  tokenUrl: string
}

export interface Scopes4 {
  'https://auth.home.juxt.site/scopes/system/read': string
  'https://auth.home.juxt.site/scopes/system/self-identification': string
  'https://auth.home.juxt.site/scopes/system/write': string
}

export interface Paths {
  '/whoami': Whoami
  '/logs': Logs
  '/users': Users
  '/openapis': Openapis
  '/users/{username}': UsersUsername
  '/api-endpoints': ApiEndpoints
  '/events': Events
  '/access-token': AccessToken
  '/resources': Resources
}

export interface Whoami {
  get: Get
}

export interface Get {
  operationId: string
  description: any
  security: Security[]
  responses: Responses
  tags: string[]
  summary: string
}

export interface Security {
  oauth: string[]
}

export interface Responses {
  '200': N200
  '401': N401
}

export interface N200 {
  content: Content
  description: string
}

export interface Content {
  'application/json': ApplicationJson
  'application/edn': ApplicationEdn
}

export interface ApplicationJson {}

export interface ApplicationEdn {}

export interface N401 {
  description: string
}

export interface Logs {
  get: Get2
}

export interface Get2 {
  operationId: string
  description: any
  security: Security2[]
  responses: Responses2
  tags: string[]
  summary: string
}

export interface Security2 {
  oauth: string[]
}

export interface Responses2 {
  '200': N2002
  '401': N4012
}

export interface N2002 {
  content: Content2
  description: string
}

export interface Content2 {
  'application/jsonline-seq': ApplicationJsonlineSeq
  'application/jsonlines': ApplicationJsonlines
  'text/plain;charset=utf-8': TextPlainCharsetUtf8
}

export interface ApplicationJsonlineSeq {}

export interface ApplicationJsonlines {}

export interface TextPlainCharsetUtf8 {}

export interface N4012 {
  description: string
}

export interface Users {
  get: Get3
  post: Post
}

export interface Get3 {
  operationId: string
  description: any
  security: Security3[]
  responses: Responses3
  tags: string[]
  summary: string
}

export interface Security3 {
  oauth: string[]
}

export interface Responses3 {
  '200': N2003
  '401': N4013
}

export interface N2003 {
  content: Content3
  description: string
}

export interface Content3 {
  'application/json': ApplicationJson2
  'application/edn': ApplicationEdn2
  'text/html;charset=utf-8': TextHtmlCharsetUtf8
}

export interface ApplicationJson2 {}

export interface ApplicationEdn2 {}

export interface TextHtmlCharsetUtf8 {}

export interface N4013 {
  description: string
}

export interface Post {
  operationId: string
  description: any
  security: Security4[]
  responses: Responses4
  tags: string[]
  summary: string
  requestBody: RequestBody
}

export interface Security4 {
  oauth: string[]
}

export interface Responses4 {}

export interface RequestBody {
  description: string
  content: Content4
}

export interface Content4 {
  'application/edn': ApplicationEdn3
  'application/json': ApplicationJson3
}

export interface ApplicationEdn3 {}

export interface ApplicationJson3 {
  schema: Schema
}

export interface Schema {
  type: string
  properties: Properties
}

export interface Properties {
  id: Id
}

export interface Id {
  type: string
}

export interface Openapis {
  get: Get4
  post: Post2
}

export interface Get4 {
  operationId: string
  description: any
  security: Security5[]
  responses: Responses5
  tags: string[]
  summary: string
}

export interface Security5 {
  oauth: string[]
}

export interface Responses5 {
  '200': N2004
  '401': N4014
}

export interface N2004 {
  content: Content5
  description: string
}

export interface Content5 {
  'application/json': ApplicationJson4
  'application/edn': ApplicationEdn4
}

export interface ApplicationJson4 {}

export interface ApplicationEdn4 {}

export interface N4014 {
  description: string
}

export interface Post2 {
  operationId: string
  description: any
  responses: Responses6
  tags: string[]
  summary: string
  requestBody: RequestBody2
}

export interface Responses6 {}

export interface RequestBody2 {
  description: string
  content: Content6
}

export interface Content6 {
  'application/json': ApplicationJson5
}

export interface ApplicationJson5 {
  schema: Schema2
}

export interface Schema2 {
  type: string
  properties: Properties2
}

export interface Properties2 {
  id: Id2
}

export interface Id2 {
  type: string
}

export interface UsersUsername {
  parameters: Parameter[]
  get: Get5
}

export interface Parameter {
  name: string
  in: string
  required: string
  schema: Schema3
  style: string
}

export interface Schema3 {
  type: string
}

export interface Get5 {
  operationId: string
  description: any
  security: Security6[]
  responses: Responses7
  tags: string[]
  summary: string
}

export interface Security6 {
  oauth: string[]
}

export interface Responses7 {
  '200': N2005
  '401': N4015
}

export interface N2005 {
  content: Content7
  description: string
}

export interface Content7 {
  'application/json': ApplicationJson6
  'application/edn': ApplicationEdn5
  'text/html;charset=utf-8': TextHtmlCharsetUtf82
}

export interface ApplicationJson6 {}

export interface ApplicationEdn5 {}

export interface TextHtmlCharsetUtf82 {}

export interface N4015 {
  description: string
}

export interface ApiEndpoints {
  get: Get6
}

export interface Get6 {
  operationId: string
  description: any
  security: Security7[]
  responses: Responses8
  tags: string[]
  summary: string
}

export interface Security7 {
  oauth: string[]
}

export interface Responses8 {
  '200': N2006
  '401': N4016
}

export interface N2006 {
  content: Content8
  description: string
}

export interface Content8 {
  'application/json': ApplicationJson7
  'application/edn': ApplicationEdn6
  'text/csv': TextCsv
}

export interface ApplicationJson7 {}

export interface ApplicationEdn6 {}

export interface TextCsv {}

export interface N4016 {
  description: string
}

export interface Events {
  get: Get7
}

export interface Get7 {
  operationId: string
  description: any
  security: Security8[]
  responses: Responses9
  tags: string[]
  summary: string
}

export interface Security8 {
  oauth: string[]
}

export interface Responses9 {
  '200': N2007
  '401': N4017
}

export interface N2007 {
  content: Content9
  description: string
}

export interface Content9 {
  'application/json': ApplicationJson8
  'application/edn': ApplicationEdn7
}

export interface ApplicationJson8 {}

export interface ApplicationEdn7 {}

export interface N4017 {
  description: string
}

export interface AccessToken {
  get: Get8
}

export interface Get8 {
  operationId: string
  description: any
  security: Security9[]
  responses: Responses10
  tags: string[]
  summary: string
}

export interface Security9 {
  oauth: string[]
}

export interface Responses10 {
  '200': N2008
  '401': N4018
}

export interface N2008 {
  content: Content10
  description: string
}

export interface Content10 {
  'text/plain;charset=us-ascii': TextPlainCharsetUsAscii
}

export interface TextPlainCharsetUsAscii {}

export interface N4018 {
  description: string
}

export interface Resources {
  post: Post3
}

export interface Post3 {
  operationId: string
  description: any
  security: Security10[]
  responses: Responses11
  tags: string[]
  summary: string
  requestBody: RequestBody3
}

export interface Security10 {
  oauth: string[]
}

export interface Responses11 {}

export interface RequestBody3 {
  description: string
  content: Content11
}

export interface Content11 {
  'application/zip': ApplicationZip
}

export interface ApplicationZip {}

async function fetchUser() {
  const res = await fetch('https://data.home.juxt.site/_site/openapi.json')
  const data = (await res.json()) as Root
  return data
}

function useUser() {
  const [user, setUser] = useState<Root>(null)
  useEffect(() => {
    fetchUser().then((user) => setUser(user))
  }, [])
  console.log(user)
  return user
}

export function Profile() {
  const user = useUser()
  return (
    <div className='flex justify-center items-center'>
      {user && (
        <div className='my-8 w-1/2'>
          <div className='px-4 sm:px-0'>
            <h3 className='text-base font-semibold leading-7 text-gray-900'>
              Profile of {user.openapi}
            </h3>
            <p className='mt-1 max-w-2xl text-sm leading-6 text-gray-500'>
              {user.info.description}
            </p>
          </div>
          <div className='mt-6 border-t border-gray-100'>
            <dl className='divide-y divide-gray-100'>
              <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                <dt className='text-sm font-medium leading-6 text-gray-900'>
                  Full name
                </dt>
                <dd className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'></dd>
              </div>
              <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                <dt className='text-sm font-medium leading-6 text-gray-900'>
                  Job Title
                </dt>
                <dd className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'></dd>
              </div>
              <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                <dt className='text-sm font-medium leading-6 text-gray-900'>
                  Email address
                </dt>
                <dd className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'></dd>
              </div>
              <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                <dt className='text-sm font-medium leading-6 text-gray-900'>
                  Salary
                </dt>
                <dd className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'></dd>
              </div>
              <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                <dt className='text-sm font-medium leading-6 text-gray-900'>
                  About
                </dt>
                <dd className='mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0'></dd>
              </div>
              <div className='px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0'>
                <dt className='text-sm font-medium leading-6 text-gray-900'>
                  Attachments
                </dt>
                <dd className='mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0'>
                  <ul
                    role='list'
                    className='divide-y divide-gray-100 rounded-md border border-gray-200'
                  >
                    <li className='flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6'>
                      <div className='flex w-0 flex-1 items-center'>
                        <PaperClipIcon
                          className='h-5 w-5 flex-shrink-0 text-gray-400'
                          aria-hidden='true'
                        />
                        <div className='ml-4 flex min-w-0 flex-1 gap-2'>
                          <span className='truncate font-medium'>
                            resume_back_end_developer.pdf
                          </span>
                          <span className='flex-shrink-0 text-gray-400'>
                            2.4mb
                          </span>
                        </div>
                      </div>
                      <div className='ml-4 flex-shrink-0'>
                        <a
                          href='#'
                          className='font-medium text-indigo-600 hover:text-indigo-500'
                        >
                          Download
                        </a>
                      </div>
                    </li>
                    <li className='flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6'>
                      <div className='flex w-0 flex-1 items-center'>
                        <PaperClipIcon
                          className='h-5 w-5 flex-shrink-0 text-gray-400'
                          aria-hidden='true'
                        />
                        <div className='ml-4 flex min-w-0 flex-1 gap-2'>
                          <span className='truncate font-medium'>
                            coverletter_back_end_developer.pdf
                          </span>
                          <span className='flex-shrink-0 text-gray-400'>
                            4.5mb
                          </span>
                        </div>
                      </div>
                      <div className='ml-4 flex-shrink-0'>
                        <a
                          href='#'
                          className='font-medium text-indigo-600 hover:text-indigo-500'
                        >
                          Download
                        </a>
                      </div>
                    </li>
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}
    </div>
  )
}

export function ProfilePage() {
  return (
    <div className='bg-white'>
      <div className='max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8'>
        <Profile />
      </div>
    </div>
  )
}
