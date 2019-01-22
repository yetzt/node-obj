#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var debug = require("debug")("opj");
var changes = require("on-change");

function opj(savefile, opts, fn){
	if (!(this instanceof opj)) return new opj(savefile, opts);
	var self = this;
	
	// optionalize options
	if (typeof opts !== 'object') var opts = {};

	// debouncing
	self.debounce = (!!opts.debounce) ? parseInt(opts.debounce,10) : 100;
	self.debouncer = null;

	// savefile
	self.savefile = path.resolve(process.cwd(), savefile);

	// load from savefile (sync for returns)
	self.data = (fs.existsSync(self.savefile)) ? JSON.parse(fs.readFileSync(self.savefile)) : (typeof opts.init !== 'undefined') ? opts.init : {};

	// return watcher
	self.watcher = changes(self.data, function(){
		debug('[change] %j', self.data);
		if (self.debouncer !== null) clearTimeout(self.debouncer);
		self.debouncer = setTimeout(function(){
			self.debouncer = null;
			fs.writeFile(self.savefile, JSON.stringify(self.data), function(err){
				if (err) return debug('[error]: %s', err);
				debug('[saved]');
			});
		}, self.debounce);
	});
	
	return self.watcher;

	/*


	// keep data
	self.data = (typeof opts.init !== 'undefined') ? opts.init : null;
	
	(function(next){
		fs.exists(self.savefile, function(ex){
			if (!ex) return next();
			fs.readFile(self.savefile, function(err, data){
				if (err) return fn(err);
				try {
					self.data = JSON.parse(data);
				} catch (err) {
					return fn(err);
				}
				debug("[loaded]");
				next();
			});
		});
	})(function(){

		// start observing
		self.data = observe(self.data).on('change', function(change){
			debug('[change] %j', change);
			if (self.debouncer !== null) clearTimeout(self.debouncer);
			self.debouncer = setTimeout(function(){
				self.debouncer = null;
				fs.writeFile(self.savefile, JSON.stringify(self.data), function(err){
					if (err) return debug('[error]: %s', err);
					debug('[saved]');
				});
			}, self.debounce);
		});
		
		return fn(null, self.data);
		
	});
	
	return self.data;
	
	*/
	
	return self.watcher;

};

module.exports = opj;