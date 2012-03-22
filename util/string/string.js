// 560
/**
 * @page can.util.lang Language Helpers
 * @parent can.util
 * @description A collection of language helpers for things like String, Objects, etc.
 * 
 * CANjs has several lightweight language helper plugins.
 * 
 * ## [can.Object Object]
 * 
 * Methods useful for comparing Objects. For example, if two
 * objects are the same:
 * 
 *     can.Object.same({foo: "bar"}, {foo: "bar"});
 *     
 * ## [can.Control Observe]
 * 
 * Makes an Object's properties observable:
 * 
 *     var person = new can.Control({ name: "Justin" })
 *     person.bind('change', function(){ ... })
 *     person.attr('name', "Brian");
 *     
 * ## [can String]
 * 
 * String helpers capitalize, underscore, and perform similar manipulations
 * on strings.  They can also lookup a value in an object:
 * 
 *    can.getObject("foo.bar",{foo: {bar: "car"}})
 * 
 * ## [can.toJSON toJSON]
 * 
 * Used to create or consume JSON strings.
 * 
 * ## [can.Vector Vector]
 * 
 * Used for vector math.
 */
//string helpers
steal('can/util',function() {
	
	// Several of the methods in this plugin use code adapated from Prototype
	//  Prototype JavaScript framework, version 1.6.0.1
	//  (c) 2005-2007 Sam Stephenson
	var undHash= /_|-/,
		colons= /==/,
		words= /([A-Z]+)([A-Z][a-z])/g,
		lowUp= /([a-z\d])([A-Z])/g,
		dash= /([a-z\d])([A-Z])/g,
		replacer= /\{([^\}]+)\}/g,
		quote= /"/g,
		singleQuote= /'/g,
		// gets the nextPart property from current
		// add - if true and nextPart doesnt exist, create it as an empty object
		getNext = function(current, nextPart, add){
			return nextPart in current ? current[nextPart] : ( add && (current[nextPart] = {}) );
		},
		// returns true if the object can have properties (no nulls)
		isContainer = function(current){
			return /^f|^o/.test( typeof current );
		},
		// a reference
		getObject;
		/** 
		 * @class can
		 * @parent can.util
		 * 
		 * A collection of useful string helpers. Available helpers are:
		 * <ul>
		 *   <li>[can.util.String.capitalize|capitalize]: Capitalizes a string (some_string &raquo; Some_string)</li>
		 *   <li>[can.util.String.camelize|camelize]: Capitalizes a string from something undercored 
		 *       (some_string &raquo; someString, some-string &raquo; someString)</li>
		 *   <li>[can.util.String.classize|classize]: Like [can.util.String.camelize|camelize], 
		 *       but the first part is also capitalized (some_string &raquo; SomeString)</li>
		 *   <li>[can.util.String.niceName|niceName]: Like [can.util.String.classize|classize], but a space separates each 'word' (some_string &raquo; Some String)</li>
		 *   <li>[can.util.String.underscore|underscore]: Underscores a string (SomeString &raquo; some_string)</li>
		 *   <li>[can.util.String.sub|sub]: Returns a string with {param} replaced values from data.
		 *       <code><pre>
		 *       can.sub("foo {bar}",{bar: "far"})
		 *       //-> "foo far"</pre></code>
		 *   </li>
		 * </ul>
		 * 
		 */
		can.extend(can, {
			esc : function(content){
				return ("" + content).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(quote, '&#34;').replace(singleQuote, "&#39;");
			},
			
			/**
			 * @function getObject
			 * Gets an object from a string.  It can also modify objects on the
			 * 'object path' by removing or adding properties.
			 * 
			 *     Foo = {Bar: {Zar: {"Ted"}}}
		 	 *     can.getObject("Foo.Bar.Zar") //-> "Ted"
			 * 
			 * @param {String} name the name of the object to look for
			 * @param {Array} [roots] an array of root objects to look for the 
			 *   name.  If roots is not provided, the window is used.
			 * @param {Boolean} [add] true to add missing objects to 
			 *  the path. false to remove found properties. undefined to 
			 *  not modify the root object
			 * @return {Object} The object.
			 */
			getObject : getObject = function( name, roots, add ) {
			
				// the parts of the name we are looking up
				// ['App','Models','Recipe']
				var parts = name ? name.split('.') : [],
					length =  parts.length,
					current,
					ret, 
					i,
					r = 0;
				
				// make sure roots is an array
				roots = can.isArray(roots) ? roots : [roots || window];
				
				if(length == 0){
					return roots[0];
				}
				// for each root, mark it as current
				while( current = roots[r++] ) {
					// walk current to the 2nd to last object
					// or until there is not a container
					for (i =0; i < length - 1 && isContainer(current); i++ ) {
						current = getNext(current, parts[i], add);
					}
					// if we can get a property from the 2nd to last object
					if( isContainer(current) ) {
						
						// get (and possibly set) the property
						ret = getNext(current, parts[i], add); 
						
						// if there is a value, we exit
						if( ret !== undefined ) {
							// if add is false, delete the property
							if ( add === false ) {
								delete current[parts[i]];
							}
							return ret;
							
						}
					}
				}
			},
			/**
			 * Capitalizes a string
			 * @param {String} s the string.
			 * @return {String} a string with the first character capitalized.
			 */
			capitalize: function( s, cache ) {
				// used to make newId ...
				return s.charAt(0).toUpperCase() + s.slice(1);
			},
			
			/**
			 * Underscores a string.
			 * @codestart
			 * can.underscore("OneTwo") //-> "one_two"
			 * @codeend
			 * @param {String} s
			 * @return {String} the underscored string
			 */
			underscore: function( s ) {
				return s.replace(colons, '/').replace(words, '$1_$2').replace(lowUp, '$1_$2').replace(dash, '_').toLowerCase();
			},
			/**
			 * Returns a string with {param} replaced values from data.
			 * 
			 *     can.sub("foo {bar}",{bar: "far"})
			 *     //-> "foo far"
			 *     
			 * @param {String} s The string to replace
			 * @param {Object} data The data to be used to look for properties.  If it's an array, multiple
			 * objects can be used.
			 * @param {Boolean} [remove] if a match is found, remove the property from the object
			 */
			sub: function( s, data, remove ) {
				var obs = [],
					remove = typeof remove == 'boolean' ? !remove : remove;
				obs.push(s.replace(replacer, function( whole, inside ) {
					//convert inside to type
					var ob = getObject(inside, data, remove);
					
					// if a container, push into objs (which will return objects found)
					if( isContainer(ob) ){
						obs.push(ob);
						return "";
					}else{
						return ""+ob;
					}
				}));
				
				return obs.length <= 1 ? obs[0] : obs;
			},
			replacer : replacer,
			undHash :undHash
		});
});