---
layout: long
title: "Notes on Programming Phoenix for Elixir"
displayTitle: "Notes on Programming Phoenix for Elixir"
date: 2017-12-15 15:54:00
metaDescription: "Notes and observations on the Phoenix web framework for Elixir"
metaKeywords: elixir, phoenix, web development, programming, software engineering
metaOgType: "article"
author: "0xADADA"
license: cc-by-nc-sa
tags: [essays]
---

Ch.1

The layers of phoenix, the endpoint is where the HTTP connection contacts phoenix, from there it goes to the router which directs a request to the appropriate controller, passing through a series of pipelines. Pipelines chain functions together to handle tasks that span across multiple controllers, such as browser requests vs API requests.

connection
|> endpoint
|> router
|> pipelines
|> controller

The purpose of the web server is to route a request to a function that performs the right task, called an action. These functions are grouped into controllers. A controller is also a series of pipelines

connection
|> controller
|> common_services
|> action

An action to show a user would look like this:

connection
|> find_user
|> view
|> template

Run phoenix inside an interactive shell: iex -S mix phx.server

In controllers, parameters come in as a Map of keys with string names:
def world(conn, %{"name" => name}) do    # string key
  render conn, "world.html", name: name  # atom key
end
Phoenix specifically converts these from String keys to atoms once inside the application boundry, because external data can't safely be converted to atoms.

Phoenix encourages breaking big functions down into smaller ones. It provides a place to explicitly register each smaller function in a way that makes it easy to understand and replace. These small pieces are orchestrated with the Plug library. The Plug library is a specification for building applications that connect with the web. Plug produces and consumes a struct called Plug.Conn, describing the entire request/response cycle of a web application, containing the request, protocol, parameters, etc. Each individual Plug should do one-thing and do it well, take the conn struct, transform it, and return it.

Plugs are just functions, and Phoenix web applications are just pipelines of Plugs.

If you look at endpoint.ex you'll see that its essentially a pipeline of functions chained together at the beginning of each request:
connection
|> Plug.Static.call
|> Plug.RequestId.call
|> Plug.Logger.call
|> Plug.Parsers.call
|> Plug.MethodOverride.call
|> Plug.Head.call
|> Plug.Session.call
|> <your app>.Router.call

The last call, to <your app>.Router.call is where endpoint.ex defers to your applications router.ex to define which controller, and subsequently, which function is invoked next in the pipeline chain. The router defines a set of pipelines for dealing with which Plugs to use prior to your conroller being called, typically:

connection
|> endpoint
|> router
|> pipeline(s)
|> controller

The pipeline(s) above will be things like :browser, handling common tasks as preventing request forgery, :fetch_session, :fetch_flash.

The controller is where business logic specific to your application lives, making data available for a view. The view subsequently substitutes values inside a template which is rendered.

Ch.2

Start an interactive Elixir shell within an Elixir application project:
iex -S mix

Structs add a constraint to Maps in that they offer protection from bad or misspelled keynames at compilation time, while Maps only throw errors during runtime when the key is first accessed. Under the covers, a Struct is just a Map with a __struct__ key.

Ch3

A view is a module containing a rendering function that converts data into a format the user will consume, like HTML or JSON. A template is a function on the view module, compiled from a file containing raw markup language and embedded Elixir code to process substitutions and loops. Views are modules responsible for rendering, and templates are the compiled functions that have static markup and native code to build pages.

EEx executes Elixir code within <%= %> tags, injecting the result into the template. EEx evalutes code within <% %> tags, but without injecting the result.

The expression <%= for user <- @users do %> walks through the users, rendering each user using the template block between the do ... end block, rolling the result up into the template.

In Phoenix, after compilation, templates are just functions. These templates are just linked lists (rather than other web frameworks that use string concatenation)– this means Phoenix doesn't have to make huge copies of large strings, resulting in performance improvements. This lets Elixir leverage modern CPU optimization since it only has a single copy of the largest strings in your application.

When a template is added to Phoenix, the view module extracts the template from the filesystem and adds it as a function on the module itself, thats why the view module is required in the first place.

Ch.4

Ecto uses a DSL that specifies how the fields in a struct map to database tables and columns. The DSL is built using Elixir macros. Virtual fields are not persisted to the database.

Models (called contexts & schemas in Phoenix 1.3) are layers of functions to transform data according to business logic. A schema is the native database form of the data, and a struct is the data once pulled out of the database. Changesets in Ecto decouple the authentication update policy separately from the database schema. This policy segregation makes handling change over time.

Ecto helps you write code to make the minimal required database operation to update a record. Ecto can enforce constraints without hitting the database.

Ch.5

Ecto.Changeset.cast converts a bare Map to a changeset, for security it limits the incoming parameters to those specified.

Module plugs vs function plugs: A function plug is a single function, a module plug is a module that provides two functions with some configuration details, otherwise they work the same. lib/rumbl_web/endpoint.ex is an example of a module plug while lib/rumbl_web/router.ex is an example of a function plug. You specify a module plug by providing a module name plug Plug.Logger while a function plug is specified by its name as an atom plug :protect_from_forgery.

To share a Plug across more than one module, you want to use a Module Plug. All plugs take a connection and return a connection.

Any values stored in conn.assigns.* is automatically available with the same name in our view. So if you assign to current_user, then @current_user can be used directly in a view.

Ch.6 Generators & Relationships

Generating resources, phx.gen.html generates simple HTML based scaffolds, phx.gen.json generates a REST-based API using JSON. They create resources for CRUD operations, creating migrations, controllers, and templates as well as tests.

An example
mix phx.gen.html Medias \
  Video videos \
  user_id:references:users \
  url:string \
  title:string \
  description:text

This includes the name of the context that holds the module, the module defines the model. The plural form of the model name, and each field with some type information. Phoenix consistently uses singular forms in models, controllers, and views. At the application boundry (URLs, table names you provide a bit more information because you can use pluralized names). Instead of using inflectors, you just explicitly set the pluralized form yourself.

Primary keys identify rows for each item in a table. Foreign keys point from one table to the primary key in another table. Foreign key lets the database get in on the act of maintaining consistency across our two relationships.

The change function handles two database functions, one for migrating up and one for migrating down. A migration up applies a migration, and a migration down reverts it. If you make a mistake a need to move a single migration up or down, you can do so.

If you meant to add a view_count field to your create_video migration, but before you migrated your database up. You would create a new migration adding the view_count field, since you haven't pushed your changes to production yet, you can roll back, make your changes, and then migrate up again. First you'd roll back your changes:
mix ecto.rollback
Verify the undo of the create_video migration. At this point, add the missing view_count field and migrate forwards with mix ecto.migrate.

A schema is responsible for tying the database fields to a field in the Elixir struct, these are defined in lib/<appname>/<contextname>/<model>.ex.

Ecto associations are explicit, you need to ask to fetch associated records specifically. Most persistence frameworks often fetch rows you don't need or fetch them in inefficient ways, over time these inefficiencies add up to major performance problems. Ecto forces the developer to pay down these performance hits early so they don't add up over time, when they're more difficult to fix.

iex> user = Repo.get_by!(User, username: "josevalim")
%{Rumbl.User{...}
iex> user.videos
#Ecto.Association.NotLoaded<association :videos is not loaded>
iex> user = Repo.preload(user, :videos)
%{Rumbl.User{...}
iex> user.videos
[] # loaded, but none are associated! yay

Repo.preload accepts one or a collection of association names, and fetches all associated data.

iex> user = Repo.get_by!(User, username: "josevalim")
iex> attrs = %{title: "hi", description: "says hi", url: "example.com"}
iex> video = Ecto.build_assoc(user, :videos, attrs)
iex> video = Repo.insert!(video)
Ecto.build_assoc builds a struct, with the proper relationship fields already set.

To fetch videos associated with a user, without storing them in a user struct:
iex> query = Ecto.assoc(user, :videos)
iex> Repo.all(query)
[%Rumbl.Video{...}]
assoc is convenient in that it returns an Ecto.Query all videos scoped to a specific user, or a list of users, we convert this query into data by calling Repo.all.

Ch.7 Ecto Queries and Constraints

Seeds are small scripts that populate the database with values every time the script is run. Phoenix stores seed scripts in priv/repo/seeds.ex. Mix tasks will run these scripts. Use mix run priv/repo/seeds.exs to add the seed data to the database.

Repo.all from c in Category, select: c.name
Repo.all means return all rows, from is a macro that builds a query, c in Category means we're pulling rows (labeled c) from the Category schema. select: c.name means we're going to return only the name field.
Repo.all from c in Category, order_by: c.name, select: c.name
will order the results by name and return a tuple containing the name and the id fields.

Ecto queries are composable, you don't need to define the entire query at once, you can combine them bit-by-bit.
iex> query = Category
iex> query = from c in query, order_by: c.name
iex> query = from c in query, select: {c.name, c.id}
#Ecto.Query<>
iex> Repo.all(query)
[...]
This works because Ecto defines a queryable protocol. from receives a queryable, and you can use any queryable as a base for a new query. An Elixir protocol defines an API for specific language features, this one defines the API for something that can be queried. This is why we can invoke Repo.all(Category) or Repo.all(query) because both Category and query implement the Ecto.Queryable protocol. By abiding to the protocol, developer can quickly layer together sophisticaed queries with Ecto.Query, maintaining sophistication without complexity.

Code that builds and transforms queries, and code that interacts with the repository should belong to the context. Code that makes requests for the data should belong to the controller—because the controller is where the web logic should live, and the database layer should be hidden within the application context with the rest of the business logic.

iex> username = "josevalim"
iex> Repo.one(from u in User, where: u.username == ^username)
%Rumbl.User{...}

Repo.one returns one row, from u in user means read from the User schema. where u.username == ^username means return the row where u.username == ^username, using the pin ^ operator means we don't want to assign the username but use its value.

Repo.one does not mean "return the first result" but "one result is expected", so if there is more, it fails. The Ecto Query API is not about composing query strings, it uses Elixir macros such that Ecto knows where user-defined variables are located, it's easier to protect the user from security flaws like SQL-injection attacks. It also helps a bit with query normalization and leverages the data types as defined in the schema for casting values at runtime.

Any functions with side effects—the ones that change the world—should remain in the controllers, while the context, model, and view layers remain side effect free. The controller receives data, either from a traditional web request, reading data from a socket, and this data is passed from the controller to various functions that transform it as it moves through the functions to the shape of our business-model requirements. Finally it makes changes to the world around us, either delivering emails, adding entries to a database, or invoking a view which is again written to the connection (another side effect), any of which can result in a business operation.

The query API supports many operators: ==, !=, <=, >=, <, >, and, or, not, in, like, ilike, is_nil, count, avg, sum, min, max, datetime_add, date_add, fragment, field, type.

Keyword syntax uses a keyword list to express a query.
iex> Repo.one from u in User,
              select: count(u.id),
              where: ilike(u.username, ^"j%") or
                     ilike(u.username, ^"c%")
the u variable is bound as part of Ecto's from macro, representing entries from the User schema. Each join in a query gets a special binding.
# count users
iex> users_count = from u in User, select: count(u.id)
#Ecto.Query<from u in Rumbl.User, select: count(u.id)>
# count usernames with a j
iex> j_users = from u in users_count, where: ilike(u.username, ^"%j%")
#Ecto.Query<from u in Rumbl.User, where: ilike(u.username, ^"%j%"), select: count(u.id)>
This query builds up a new query, normalizing as it builds, upon the saved query, we even built the query using the same bound variable name, u, but we didn't have to.

The pipe syntax allows developer to build queries by piping through query macros. Each pipe takes a queryable and returns a queryable.
iex> User |>
     select([u], count(u.id)) |>
     where([u], ilike(u.username, ^"j%") or ilike(u.username, ^"c%")) |>
     Repo.one()
[debug] QUERY OK source="users" db=4.5ms
SELECT count(u0."id") FROM "users" AS u0 WHERE ((u0."username" ILIKE $1) OR (u0."username" ILIKE $2)) ["j%", "c%"]
5
Because each segment of the pipe works independently of the others, we need to specify the binding manually for each one.

Fragments offer an escape hatch from Ecto's Query API. The best abstractions offer an escape hatch, and since Ecto's Query API doesn't represent every query the database layer can provide, Ecto's query fragments send part of the query directly to the database but allows you to construct it in a safe way, like this:
iex> from(u in User,
     where: fragment("lower(username) = ?",
                     ^String.downcase(uname)))

When all else fails, you can directly run SQL statements with Ecto.Adapters.SQL.Query:
iex> Ecto.Adapters.SQL.query(Rumbl.Repo, "SELECT power($1, $2)", [2, 10])
SELECT power($1, $2) [2, 10]
{:ok, %Postgrex.Result{ columns: ["power"], command: :select, connection_id: 5979, num_rows: 1, rows: [[1024.0]] }}

Ecto relationships are explicit:
iex> user = Repo.one from(u in User, limit: 1)
iex> user.videos
#Ecto.Association.NotLoaded<association :videos is not loaded>
iex> user = Repo.preload(user, :videos)
iex> []
Ecto allows us to preload associations directly as part of a query:
iex> Repo.all from u in User,
     join: v in assoc(u, :videos),
     join: c in assoc(v, :category),
     where: c.name == "Comedy",
     select: {u, v}
[{%Rumbl.User{...}, %Rumbl.User{...}}]

Constraints allow developers to use underlying relational, and can solve potential race conditions:
1. User sends a category ID through the form.
2. Perform a query to check if the category ID exists in the DB.
3. If the category ID exists, add the video with the category ID to the database.
However, someone could delete the category ID between steps 2 and 3, allowing a video insertion without and existing category. This will lead to inconsistent data over time. Phoenix uses constrains to manage change in a way that combines the harsh protections of the database with Ecto's gentle guiding hand to report errors without crashing. Some terms:

constraint: An explicit database constraint, a uniqueness constrain, or an index, or and integrity constraint between primary and foreign keys.
constraint error: The Ecto.ConstraintError.
changeset constraint: A constraint annotation allowing Ecto to convert constraint errors into changeset error messages.
changeset error messages: Beautiful error messages for the consumption of people.

Ecto allows the application layer (and web server) to use database services like referential integrity and transactions to strike a balance between the needs of the application layer and the needs of the database. Ecto rewards developers the many guarantees databases offer with data integrity in the short term, by transforming constraint errors into user feedback, and in the longer term by guaranteeing you wont be awake at 3am fixing bugs caused by inconsistent data.

IEx allows us to fetch a previous value using v(n), where n is the number of the expression, you can alsop ass negative values to grab the last nth expression.

iex> alias Rumbl.Repo
Rumbl.Repo
iex> category = Repo.get_by(Rumbl.Medias.Category, name: "Drama")
%Rumbl.Medias.Category{
  __meta__: #Ecto.Schema.Metadata<:loaded, "categories">,
  id: 2,
  inserted_at: ~N[2017-11-05 18:02:12.006642],
  name: "Drama",
  updated_at: ~N[2017-11-05 18:02:12.006653]
}
iex> Repo.delete(category)
[debug] QUERY ERROR db=6.5ms
DELETE FROM "categories" WHERE "id" = $1 [2]
** (Ecto.ConstraintError) constraint error when attempting to delete struct:
    * foreign_key: videos_category_id_fkey
We previously added a video using the Drama category, so the database prevents deletion of the category as it is tied to the video and would create orphaned records. Use foreign_key_constraint, which is like assoc_constraint used earlier, except it doesn't inflect the foreign key from the relationship.

This is particularly useful if you want to provide reasons why a category can not be deleted.
iex> import Ecto.Changeset
Ecto.Changeset
iex(22)> changeset = Ecto.Changeset.change(category)
#Ecto.Changeset<action: nil, changes: %{}, errors: [], data: #Rumbl.Medias.Category<>, valid?: true>
iex> changeset = foreign_key_constraint(changeset, :videos, name: :videos_category_id_fkey, message: "still exists")
#Ecto.Changeset<action: nil, changes: %{}, errors: [],
                data: #Rumbl.Medias.Category<>, valid?: true>
iex> Repo.delete(changeset)
[debug] QUERY ERROR db=8.8ms
DELETE FROM "categories" WHERE "id" = $1 [2]
{
  :error,
  #Ecto.Changeset<
    action: :delete,
    changes: %{},
    errors: [videos: {"still exists", []}],
    data: #Rumbl.Medias.Category<>,
    valid?: false
  >
}
because the foreign key is established in the videos table, we need to explicitly call this out in the call to foreign_key_constraint. The work best suited for the database must be done in the database.

The *_constraint changeset functions are useful when the constraint being mapped is triggered by external data, often as part of the user request. Using changeset constraints only makes sense if the error message can be something the user can take useful action on.

Ch.8 Testing MVC

Testing principals
Fast — tests should run quickly and concurrently if possible
Isolated — Tests that are too isolated wont have enough context to be useful, tests that aren't isolated enough are difficult to understand and maintain
DRY — Strive to eliminate repetition in tests
Repeatable — The same test on the same code should always yield the same result

unit test — exercises a function for one layer of your application
integration test — focuses on the way different layers of an application fit together. An example is a controller test that makes a request to and endpoint, flows through the pipelines, reads from the database, and renders through views just like a Phoenix request would
acceptance test — test how multiple actions work together. A single acceptance test case may sign the user on, perform several calculations that build upon each other, then sign off.

ExUnit has three main macros, setup macro specifies setup code that runs before each test is run. test macro defines a single isolated test, it defines a hypothesis about code. Finally, assert macro specifies something we believe to be true about code, if true, the test passes.
defmodule MyTest do
  use ExUnit.Case, async: true
  setup do
    :ok
  end
  test "pass" do
    assert true
  end
  test "fail" do
    assert false
  end
end

This code runs two tests, first setup is run, then the "pass" test case. Next setup is run, and the "fail" test case. The output is a passing test case and a failing test case.

Tests will generally use <AppName>.ConnCase meaning you get <AppName>.Router.Helpers, and Ecto imports along for free.

ExUnit calls tests with
test "GET /", %{conn: conn} do
  conn = get(conn, "/")
  assert html_response(conn, 200) =~ "Welcome to Phoenix!"
 end
by calling get(conn, "/") rather than calling the index action on the controller directly. This practice gives the test the right level of isolation because we're using the controller the same way Phoenix does. Phoenix also provides test helpers to make testing responses easier.
assert html_response(conn, 200) ~= "Welcome to Phoenix!"
which does the following:

    asserts the response was 200
    content-type was text/html
    return the response body, allowing us to match on the contents

this also exists for JSON called json_response that allow for assertions like
assert %{user_id: user.id} = json_response(conn, 200)

ExUnit tags help when setup is different from test to test. When specifying a tag, ExUnit makes that information available within the setup block via callbacks.
setup %{conn: conn} = config do
  if username = config[:login_as] do
    user = insert_user(username: username)
    conn = assign(conn, :current_user, user)
    {:ok, conn: conn, user: user}
  else
    :ok
  end
end

@tag login_as: "max" # this is the tag
test "list all user's videos on index", %{conn: conn, user: user} do
# ...
tags take either a keyword list (above) or an atom as arguments. The config map contains the conn and tag (either atom or keyword list). In this case if login_as has a value, we use it to login the user and return an updated conn with the user, otherwise we return an :ok.

Writing unit tests directly against a function like the Auth plug will result in unexpected errors during the testing/coding cycle because calls directly to the function will get results that have not gone through the endpoint, router or other pipelines. The data has not been fully transformed, so the results will not reflect the state that the implementation sees when running in a server. The bypass_through helper that ConnCase provides allows developer to send a connection through the endpoint, router, and desired pipelines but bypass the route dispatch. This approach gives developer a connection wired up with all the transformations the specific tests require, such as fetching the session and adding flash messages.
  setup %{conn: conn} do
    conn =
      conn
      |> bypass_through(RumblWeb.Router, :browser)
      |> get("/")

    {:ok, %{conn, conn}}
  end

  test "authenticate_user halts when no current_user exists", %{conn: conn} do
    conn = Auth.authenticate_user([])
    assert conn.halted
  end
The setup block calls bypass_through, passing the router and the :browser pipeline to invoke. When the get request is invoked, it accesses the endpoint and stops at the browser pipeline, as requested. The path "/" given to the get isn't used by the router when bypassing, its just stored in the connection, this provides all the requirements for a plug with a valid session and flash message support.

Since most repository-related functionality will be tested with integration tests as they insert and update records, but we want to be sure to catch some error conditions as close to the breaking point as possible. One example is the uniqueness constraint checks in the changeset. It has side effects because we're going to need to create a record and then test against it.

Chapter 9: Watching Videos

alter table(:videos) do
  add :slug, :string
end
the alter macro changes the schema for both up and down migrations. The premise of a slug is so you can permanently generate a name from the data in other fields, some of which may be updatable.

    Because Ecto separates changesets from the definition of a database record (model), this gives developer the ability to have different change policies for any type of change to the record.
    Changesets act as a funnel to the database, filtering and casting incoming data, making sure sensitive fields like user role cannot be set externally, while casting them to the type defined in the schema.
    Changesets can validate data, for example the length of a field— on the fly, but validations that depend on database integrity are left to the database, in the form of constraints.
    Changesets make the code easier to reason about, can be composed, allowing each part of a data transformation to be a more easily comprehend–able and testable function.

In viws you may see a video_path, or watch_path, or x_path() helpers. These helper functions are generated by RumblWeb.Router and imported into controllers and views by rumble_web/web.ex. watch_path(@conn, :show, video) takes the Video struct, and by conventions it generates a URL by extracting the ID from the Video struct. This works because Phoenix knows to use the ID field to generated the URL because Phoenix implements the Phoenix.Param protocol. Developer can customize this behavior by implementing our own functions to override the default protocol implementation to generate the URL using the slug.
defimpl Phoenix.Param, for: Rumbl.video do
  def to_param(%{slug: slug, id: id}) do
    "#{id}-#{slug}"
  end
end

The advantage of implementing this behavior change as a Protocol implementation is the clean polymorphism we get by extending Phoenix parameters without having to change Phoenix itself or the Video module itself.


Chapter 10: Using Channels

A client connects to a channel over a socket, then sends and receives messages, that's it. A Phoenix channel is a conversation, the channel sends messages, receives messages, and keeps state. Just as controllers receive requests, channels receive events.

A Phoenix conversation (messages sent, messages received) is about a topic, and the topic maps onto application concepts like a chat room, local map, or annotations to a video. Each user's conversation on a topic has its own isolated, dedicated process. 

Whereas the traditional web-based request/response interactions are stateless, conversations in an Elixir process can be stateful. This means for sophisticated interactions like games and more interactive pages, developer doesn't need to use local storage, cookies, or databases to keep track of the state of the conversation. Each call to the channel simply picks up where it left off. This only works if the framework supports true isolation and concurrency: one process must be isolated, not affect others, and true concurrency means lightweight abstractions that don't bleed into one another. Channels must scale in the dimensions developer is most concerned about: code complexity, performance, and manageability.

The application channel is simple, but it must manage three things:

    making and breaking connections
    sending messages
    receiving messages

A socket establishes a new connection with a socket. After a connection is made, that same socket will be transformed through the life of the connection. The socket is a representation of a continuous ongoing conversation between the client and the server. When a connection is made, the initial socket is created, and that same socket is transformed with each new received event, through the whole life of the conversation.

The socket is an abstraction over a websocket, or to handle older clients, a longpoll. The socket abstracts the transport layer, and Phoenix handles the rest.

A channel is a conversation about a topic, the topic has an identifier of videos:<video id> where video_id is a dynamic id matching a record in the database. Topic identifiers generally take the form topic:subtopic where topic is often a resource name and subtopic is the instance ID that usually identifies a row in the database.

Topics are organizing concepts, they are used as parameters to functions, and used in URLs to identify conversations. Just like a URL passes an :id parameter to represent a request for a resource from a controller; with channels, developer can use the topic ID to scope a channel connection.

Phoenix channels define "callbacks", or functions that respond to channel events such as join below:
def join("videos:" <> video_id, _params, socket) do
  {:ok, assign(socket, :video_id, String.to_integer(video_id))}
end
in the above code, assign(socket...) returns a socket, resulting in a {:ok, socket} returning for authorized users or {:error, socket} which will deny joining the channel. Sockets maintain state in a socket.assigns map, and the above adds the video id to the assigns map using the helper function assign(socket, :video_id, String.to_integer(video_id)).

Socket state is maintained for the duration of the connection. The socket is transformed in a loop rather than a single pipeline. The socket state changed in the above "assign()" call will be accessible later as events come into and out of the channel. This small difference leads to enormous differences in efficiency between the channels API and the controllers API.

Channels receive events with an event name, such as new_message, and include a payload of arbitrary data.
Each channel module can receive events in three ways

    handle_in receives direct channel events
    handle_out intercepts broadcast events
    handle_info receives OTP messages

handle_info is invoked whenever an Elixir message reaches the channel.

Session-based authentication makes sense for request/response–type applications, but for channels, token authentication works better because the connection is a long-duration connection. With token authentication, each user gets a unique token. Tokens allow for a secure authentication mechanism that doesn't reply on any specific transport. Once the user is already authenticated using the request/response traditional approach, the application can expose the token to the frontend, and this token can be used by the channel.

Chapter 11: OTP

OTP is a way to think about concurrency and distribution, using patterns that allow developer to use concurrency to build state without language features that rely on mutability.

OTP is the name of the library encapsulating concurrent state and behavior, and the abstractions is called generic server, or GenServer.

Supervisors need to be able to restart processes in the right way, according to policies that are best for the application. For example, suppose a database was upgraded, and the connection stopped. The application would need to automatically kill and restart the connection pool. This policy should not impact the code that uses the database. If developer can replace a simple supervisor process with a supervisor tree, we can build much more robust fault-tolerance and recovery software.

In Phoenix, there is little code attempting to deal with every possible error exception. Instead, we trust the error reporting to log the errors so developer can fix what's broken, and in the meantime, supervisor tree can automatically restart services in a last good state. OTP captures these clean abstractions in a coherent library, allowing developer to declare the supervision properties that most interest us. This allows developer to build robust self-healing software without building complex self-healing software.

A supervision strategy is what policy is used when a process dies, for example, the :one_for_one policy will restart a child process when the child dies. If all resources depend on a common service, developer could specify :one_for_all to kill and restart all child processes if any child dies. Developer doesn't need to add any code to fully supervise every process, only configure a policy to tell OTP how to handle each crash.

The default restart strategy is :permanent, the supervisor always restarts child processes with this strategy. With :temporary, the child process is never restarted. Under :transient, the child is restarted of if it terminates abnormally, with an exit reason other than :normal, :shutdown, or {:shutdown, term}.

:temporary is useful when a restart is unlikely to resolve a worker crash, or when restarting doesn't make sense based on the flow of the application.

Child processes can have different restart strategies, supervisors have configurable supervision strategies. 

:one_for_one if a child terminates, the supervisor restarts only that process
:one_for_all if a child terminates, a supervisor terminates all remaining children, the restarts all children
:rest_for_one if a child terminates, a supervisor terminates all children defined after the one that died, then restarts all terminated processes
:simple_on_for_one Similar to :one_for_one but used when a supervisor needs to dynamically supervise processes. For example, a web server would use it to supervise web requests, which may be 10, 10,000, or 100,000 processes.

A channel in Phoenix is an OTP process built to serve a single user in the context of a single conversation on a topic.

When fetching real-time (pp 212) data about a video that will be synched in real-time, a network or failure by the 3rd party can occur, but since we're making multiple requests, we can ignore the failure and use the responses from the successful requests. The restart strategy spawns multiple processes and shouldn't restart the failures because its time sensitive, the errors can simply be moved past, we'll accept any successful requests that return, so we'll use the :temporary restart strategy.

OTP applications protect in both directions, that is, if the Phoenix server itself crashes, we bring down the children processes and restart them so no resources are leaked. When a child process crashes, we bring down that process and restart it so we can attempt clean recovery. When building a supervisor and children, the process of defining the restart strategy and supervision strategy lets developer focus on the main application logic, as any unknowable error handling is already taken care of. Let the errors crash gracefully, and OTP will handle the rest.

Because GenServer's are meant to be generic servers, they hold both computation and state. However, in many cases, we want a process to store state only, or only execute a particular function. An agent is a simple GenServer

Chapter 12: Observer and Umbrellas


Umbrella projects allow developer to develop and test multiple child applications in isolation side by side while providing conveniences for configuring and building them only once. Instead of breaking the application into multiple applications in distinct source-code repositories, which adds too much overhead to the development workflow, you can use Umbrella projects. The combination of Mix and OTP make this abstraction a good one for separating core concerns and dealing with complexity.

Observer is an Erlang tool for understanding all running processes in an application. To start:
iex -S mix
> :observer.start
The tool visualizes different aspects of the application, lets developer see a list of all running processes, how much memory, messages the system is using. Developer can more easily see where bottlenecks occur by finding processes with large numbers of messages.

Each Umbrella has a parent directory that defines

    The shared configuration of the project
    The dependencies for that project
    the apps directory with child applications

to create new Umbrella projects, use mix new <name> --umbrella outside of your application, which stubs out a simpler Phoenix app, this project can then be moved inside the parent project.

Chapter 13: Testing Channels and OTP
Stubs and mocks are both testing fixtures that replace real world implementations. A stub replaces real-world libraries with simpler, predictable behavior. With a stub, developer can bypass code that would be difficult to test. Stubs should have nothing to say whether a test should pass or fail. Stubs are a simple scaffold implementation standing in for a more complex real-world implementation.

A mock is similar, but replaces real-world behavior just as a stub does, but it allows developer to specify expectations and results, playing back those expectations at runtime. A mock will fail a test if the test code doesn't receive the expected function calls. A mock is an implementation that records expected behavior at definition time and plays it back at runtime, expecting those results.

Within the Elixir community, avoid mocking whenever possible. Most mocking libraries end up changing global behavior—for example, by replacing a function in the HTTP client library to return a particular result. These function replacements are global, so a change in one place would change all code running at the same time. That means tests written in this way can no longer run concurrently. These strategies will snowball, requiring more and more mocking until the dependencies among components are completely hidden.

A better strategy is to identify code that's difficult to test live, and to build a configurable, replaceable testing implementation rather than a dynamic mock. The development and production code will use the simple :httpc client, and the testing code will use a stub that is called during the tests.

A major advantage of writing asynchronous tests in OTP is the tests run concurrently, meaning they can be run in parallel, so the entire suite of tests can finish more quickly than their synchronous counterparts.
