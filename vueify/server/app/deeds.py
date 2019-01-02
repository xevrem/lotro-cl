import aiofiles
import json


DEED_CATEGORIES = {
  'CLASS':'class_deeds.json',
  'RACE':'race_deeds.json',
  'SHADOWS OF ANGMAR':'soa_deeds.json',
  'THE MINES OF MORIA':'mom_deeds.json',
  'ALLIES TO THE KING':'aotk_deeds.json',
  'THE STRENGTH OF SAURON':'tsos_deeds.json',
  'THE BLACK BOOK OF MORDOR':'bbom_deeds.json',
  'REPUTATION':'rep_deeds.json',
  'ERIADOR':'eriador_deeds.json',
  'RHOVANION':'rhov_deeds.json',
  'GONDOR':'gondor_deeds.json',
  'MORDOR':'mordor_deeds.json',
  'SKIRMISH':'skirm_deeds.json',
  'INSTANCES SHADOWS OF ANGMAR':'soa_inst_deeds.json',
  'INSTANCES MINES OF MORIA':'mom_inst_deeds.json',
  'INSTANCES LOTHLORIEN':'loth_inst_deeds.json',
  'INSTANCES MIRKWOOD':'mirk_inst_deeds.json',
  'INSTANCES IN THEIR ABSENCE':'ita_inst_deeds.json',
  'INSTANCES RISE OF ISENGUARD':'isen_inst_deeds.json',
  'INSTANCES ROAD TO EREBOR':'erebor_inst_deeds.json',
  'INSTANCES ASHES OF OSGILIATH':'osg_inst_deeds.json',
  'INSTANCES BATTLE OF PELENNOR':'pel_inst_deeds.json',
  'SOCIAL, EVENTS, AND HOBBIES':'seh_deeds.json',
  'SPECIAL':'bobb_deeds.json'
}

deeds = {}

async def load_deeds_file(filename):
  async with aiofiles.open(filename, mode='r') as f:
    return await f.read()

async def load_all_deeds():
  
  for key,filename in DEED_CATEGORIES.items():
    js = await load_deeds_file(f'data/{filename}')
    data = json.loads(js)
    deeds[key] = data


async def setup_deeds():
  await load_all_deeds()