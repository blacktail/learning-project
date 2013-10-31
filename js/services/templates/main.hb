<div class="small-4 large-3 columns">
	<div id="sidePanel">
		<div id="sideTitle" class="shadow-back">
			<h4>Services <a id="btnAddServ" class="radius"></a></h4>
			
			<input id="searchBox" class="radius" placeholder="Search for a service">
		</div>

		<div id="servTreeCon">

		</div>
	</div>
</div>
<div class="small-8 large-9 columns">
	<div id="servTitle" class="panel radius">
		<h3>Portal <span>http://potal.com</span></h3>
		<div id="alertInfo">Alerts <span>Minimize Alerts</span></div>
		<div id="alertBtns">
			<a id="btnAcknowlege" class="button small radius">ACKNOWLEGE</a><a id="btnViewAlertHist" class="button tiny radius">VIEW ALERT HISTORY</a>
		</div>
	</div>
	<div id="servCon" class="section-container tabs" data-section="tabs">
		<section>
			<p class="title radius" data-section-title><a href="#">Status</a></p>
			<div class="content" data-section-content>
				Status
			</div>
		</section>
		<section class="active">
			<p class="title" data-section-title><a href="#">Configuration</a></p>
			<div class="content" data-section-content>
				<h4>General info<span>(service name, url, schedule, and more)</span></h4>
				<form>
					<div class="row">
					<div class="small-7 columns">
						<div class="row">
							<span class="inline-label">Enable Monitoring</span> <input type="checkbox" name="isMonitoring" id="isMonitoring">
							<span class="inline-label">Enable Alering</label> <input type="checkbox" id="isAlerting" name="isAlerting">
						</div>

						<div class="row">
							<label>URL to Check</label>
							<div class="row collapse">
							    <div class="small-3 large-2 columns">
							      <span class="prefix">http://</span>
							    </div>
							    <div class="small-5 large-7 columns">
							      <input type="text" placeholder="Enter your URL...">
							    </div>
							    <div class="small-4 large-3 columns">
							      <a href="#" class="button prefix secondary">CHECK URL</a>
							    </div>
							</div>
						</div>

						<div class="row">
							<label>Service Name</label>
							<input type="text" name="servName" id="servName">
						</div>

						<div class="row">
							<label>Description</label>
							<textarea id="servDesc" name="servDesc"></textarea>
						</div>
					</div>
					<div class="small-5 columns">
						<div class="row">
								<label class="inline-label">Check this service every</label>
								<select>
									<option value="1m">1 min</option>
								</select>
						</div>

						<div class="row">
							<label class="inline-label">Declare service down after</label>
							<select>
								<option value="1m">1 min</option>
							</select>
						</div>

						<div class="row">
							<br>
							<label>Alert type if declared down:</label>
							<select>
								<option>Warning</option>
							</select>
							<span class="inline-label">for</span>
							<select>
								<option>
									all
								</option>
							</select>
							<span class="inline-label">testing locations</span>

							<br>
							<select>
								<option>None</option>
							</select>
							<span class="inline-label">for individual testing locations</span>
						</div>
					</div>
					</div>
				</form>
			</div>
		</section>
		<section>
			<p class="title" data-section-title><a href="#">SDT</a></p>
			<div class="content" data-section-content>
				SDT
			</div>
		</section>
	</div>
</div>
