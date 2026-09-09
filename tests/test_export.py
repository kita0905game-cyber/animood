import copy
import importlib.util
import unittest
from pathlib import Path
spec = importlib.util.spec_from_file_location('exporter',Path(__file__).resolve().parents[1]/'tools/export_airtable.py')
exporter = importlib.util.module_from_spec(spec)
spec.loader.exec_module(exporter)

class ExportTests(unittest.TestCase):
    def snapshot(self):
        import json
        fields = {'Evaluation Status':{'name':'評価済み'},'Public Ready':True,
                  'Viewing State':'視聴済み','Confidence':'中','Provenance':'AI暫定推定',
                  'Core Appeal':'理由','Evaluation Evidence':'Approved',
                  'Public Profile':json.dumps({'schemaVersion':1,'id':'test','title':'Title','reason':'Reason','tags':[],
                    'ja':{'title':'作品','reason':'理由','tags':[]},'experienceFit':{'mind':5}}),
                  'User Review':'PRIVATE','Reference Notes':'PRIVATE','Legacy Category':'PRIVATE'}
        fields.update({f:3 for f in exporter.TRAITS})
        return {'complete':True,'totalRecordCount':1,'baseId':'appXkCYzNbv1LDV6O','tableId':'tblokhzcBwhVIZwTv','records':[{'id':'a','fields':fields}]}
    def test_public_gate(self):
        s=self.snapshot(); s['records'][0]['fields']['Evaluation Status']='未評価'
        self.assertEqual(exporter.export(s),[])
        s=self.snapshot(); s['records'][0]['fields']['Public Ready']=False
        self.assertEqual(exporter.export(s),[])
    def test_null_and_privacy(self):
        result=exporter.export(self.snapshot())[0]
        self.assertIsNone(result['scores']['gore'])
        self.assertNotIn('PRIVATE',str(result))
    def test_invalid_approved_record_does_not_silently_drop(self):
        s=self.snapshot(); s['records'][0]['fields']['Funny']=0
        with self.assertRaises(ValueError): exporter.export(s)
    def test_partial_snapshot(self):
        s=self.snapshot();s['complete']=False
        with self.assertRaises(ValueError): exporter.export(s)
    def test_stale_translation(self):
        s=self.snapshot();s['records'][0]['fields']['Core Appeal']='変更'
        with self.assertRaises(ValueError): exporter.export(s)
    def test_unwatched(self):
        s=self.snapshot();s['records'][0]['fields']['Viewing State']='未視聴'
        with self.assertRaises(ValueError): exporter.export(s)

if __name__ == '__main__': unittest.main()
