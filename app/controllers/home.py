from ferris import Controller
import os

class Home(Controller):

 def list(self):
  # for cachebusting
  version_id = os.environ['CURRENT_VERSION_ID']
  version_split = version_id.split('.')
  self.context['version'] = version_split[0]
  self.context['version_id'] = version_split[1]