from pysqlite2 import dbapi2 as sqlite3

"""
This seemed like a great idea at first, but it's not:

- HTTP pipelining might generate 8 (or maybe more?) requests,
each sending an "old" cookie (by the 2nd request)

- Passive attackers are more likely to be interested in actual
private payload data (text messages, etc)

- Just use HTTPS 
"""

"""
Design notes:

Just because a client made a request and a response was sent with a
new cookie, does not mean the client ever actually saved the cookie.

Just because a client made a request some cookie, does not mean
they flushed this cookie to disk.
	(this is just a risk we have to take, though)


Changing the cookie every few seconds could lead to increased disk
activity. Maybe user should be a way to turn this off, or increase
the interval at which the cookie is changed?
"""


class Sessions(object):
	"""
	The design of Sessions allows constantly replacing the client's
	cookie, which enhances session security.

	(Passive attackers logging cookies will have a very limited window
	to hijack the session. This limited window requires writing specialized
	software to immediately hijack the session.)

	Changing the cookie frequently also makes it easy to throw away
	

	The only reason IP is stored in this table is so that sessions can
	be restricted to one IP.

	If this feature is not necessary, remove it.


	This class should not know about HTTP cookie header format, because
	the cookie will be changed when using the Flash socket communication too.
	"""

	def open(self, filename):
		self._conn = sqlite3.connect(filename)

		c = self._conn.cursor()

		c.execute('PRAGMA legacy_file_format = false')
		c.execute('PRAGMA synchronous = OFF')
		c.execute('PRAGMA temp_store = MEMORY')

		c.execute('''\
create table if not exists cookie_map
(cookie BLOB, ip BLOB, session INTEGER PRIMARY KEY AUTOINCREMENT)''')

		c.execute('''\
create unique index if not exists cookie_index on cookie_map
(cookie)''')

		self._conn.commit()

		# We can also close the cursor if we are done with it
		c.close()


	def get(self, cookie):
		"""
		Get the session number for a cookie.
		"""
		c = self._conn.cursor()
		c.execute("select session from cookie_map where cookie=?", (buffer(cookie),))
		row = c.fetchone()
		if not row:
			return None
		else:
			return row[0]


	def add(self, cookie, ip):
		"""
		Create a new cookie -> session mapping.
		"""
		c = self._conn.cursor()
		c.execute("insert into cookie_map values (?, ?, NULL)", (buffer(cookie), buffer(ip)))

		# TODO: optimize
		# http://www.sqlite.org/c3ref/last_insert_rowid.html
		session = self.get(cookie)
		if session is None:
			raise RuntimeError("Why is the cookie not in the table? I just added it.")

		# Save (commit) the changes
		self._conn.commit()

		return session


	def update(self, session, cookie):
		"""
		Change a session's cookie.
		"""
		c = self._conn.cursor()
		c.execute("update cookie_map set cookie=? where session=?", (buffer(cookie), session))
