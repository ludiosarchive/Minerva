
def todo(reasonOrMethod):
	"""
	This is a both a decorator and a decorator-returner, depending on
	what C{reasonOrMethod} is.

	This allows you to do

	@todo
	def test_that_will_fail(self):
		...

	or

	@todo("some reason or explanation")
	def test_that_will_fail2(self):
		...
	"""

	if hasattr(reasonOrMethod, '__call__'):
		method = reasonOrMethod
		method.todo = 'todo'
		return method

	def decorator(method):
		method.todo = reasonOrMethod
		return method

	return decorator


